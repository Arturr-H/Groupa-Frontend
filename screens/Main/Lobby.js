import { View, Image, ActivityIndicator, Text, PanResponder, Animated, Easing } from "react-native";
import { def, styles as style, width, height, stylevar } from "../../Style";
import React from "react";
import { BIGTEXT, P, StartButton, Toast, BackButton } from "../../components/AtomBundle";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ServerHandler } from "../../func/ServerHandler";
import { Haptic } from "../../func/Haptic";
const styles = { ...style.lobby, ...style.chat } /*- Lobby styles lies here -*/

/*- The websocket client -*/
const MAX_USERS = 2;
const MIN_USERS = 1;

/*- How many times the client should try to reconnect if failed -*/
const MAX_POLLING = 5;

// TODO: Make a cache map for every SUID - to avoid unnecessary requests

/*- The user that will be joining -*/
class UserPfp extends React.PureComponent {
	constructor(props) {
		super(props);
		
		this.suid = this.props.user;
		this.index = this.props.index;
		this.userData = this.props.userData.data;
		this.onKickStateChange = this.props.onKickStateChange;
		this.draggable = this.props.draggable;

		/*- Changeable -*/
		this.state = {
			drag: new Animated.ValueXY(),
			drag_enabled: true,
			dragging: false,
		};

		/*- Bind -*/
		this.username = this.username.bind(this);
		this.animate = this.animate.bind(this);

		this.center = { y: -height*0.8 };

		/*- Pan responder -*/
		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (_, gesture) => {
				if (this.state.drag_enabled) {
					this.state.drag.setValue({ x: gesture.dx, y: gesture.dy });


					/*- Get the distance from the center and change the rotation speed accordingly -*/
					const distance_from_center_y = Math.abs(350 + this.center.y - gesture.dy);
					const distance_from_center_x = Math.abs(width*0.3 - gesture.dx);

					const distance_from_center = Math.sqrt(Math.pow(distance_from_center_y, 2) + Math.pow(distance_from_center_x, 2));
					this.onKickStateChange({
						rotation: distance_from_center,
					});
				}
			},
			onPanResponderRelease: () => {
				this.state.drag.flattenOffset();
				this.animate(this.state.drag, { x: 0, y: 0 }, 500);
				this.setState({ dragging: false });
			},
			onPanResponderGrant: () => {
				this.setState({ dragging: true });
			},
		});
	}

	/*- Simple animate function to avoid repetitive code [ ugly >:( ]  -*/
	animate(value, toValue, duration, callback) {
		Animated.timing(value, {
			toValue,
			duration: duration,
			useNativeDriver: true,
			easing: Easing.bezier(0.165, 0.84, 0.44, 1.0)
		}).start();

		setTimeout(() => {
			if (callback) callback();
		}, duration);
	};

	/*- Backend server URL handling -*/
	_server_handler = new ServerHandler();
	_server_url     = this._server_handler.get_url();
	_server_cdn     = this._server_handler.get_cdn();

	/*- Make a username -*/
	username(n) {
		return `@${n}`;
	}

	/*- Render -*/
	render() {
		return (
			<Animated.View style={[styles.lobbyPfpContainer,
				this.draggable ? styles.lobbyPfpContainerDraggable : null, {
				transform: [
					{ translateX: this.state.drag.x },
					{ translateY: this.state.drag.y },
				],
				backgroundColor: this.state.dragging ? stylevar.colors.fg_transparent : null,
			}]}
				{...this.draggable ? {...this.panResponder.panHandlers} : null}
			>
				<Image
					key={this.index}
					source={{ uri: this.userData.profile }}
					style={styles.lobbyProfileImage}
				/>
				<Text style={[styles.chatMessageUserText, { textAlign:"center" }]}>{
					this.props.suid === this.userData.suid
						? "You"
						: this.username(this.userData.username)
				}</Text>
			</Animated.View>
		);
	};
};

/*- Kick user circle -*/
class KickUser extends React.PureComponent {
	constructor(props) {
		super(props);
		
		/*- Changeable -*/
		this.state = {
			rotation: new Animated.Value(0),
			scale: new Animated.Value(1),
			hasBeenVibrated: false,
		};

		this.rotation = this.props.rotation;
	};

	/*- Rotate -*/
	componentDidUpdate() {
		this.rotation = this.props.rotation;

		/*- The rotation is also the distance from the KickUserButton -*/
		if (this.rotation < 50) {
			this.state.scale.setValue(1.2);

			/*- Vibrate if the user hasn't been vibrated yet -*/
			if (!this.state.hasBeenVibrated) {
				Haptic("heavy");
				this.setState({ hasBeenVibrated: true });
			}
		}else {
			this.state.scale.setValue(1);

			/*- Stop vibrating -*/
			if (this.state.hasBeenVibrated) {
				Haptic("medium");
				this.setState({ hasBeenVibrated: false });
			}
		}
		this.state.rotation.setValue(this.rotation / 50);
	};

	/*- Render -*/
	render() {
		return (
			<Animated.View style={[styles.kickUserButton, {
				transform: [
					{ rotate: this.state.rotation },
					{ scale: this.state.scale },
				]
			}]}></Animated.View>
		);
	};
};

/*- The scene -*/
class Lobby extends React.PureComponent {

	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			users: [],
			UserCache: {},
			noticeEnabled: false,
			notice: "",
			roomFound: "",
			isHost: false,
			roomid: "",
			suid: "",

			kickUserButton: {
				rotating: false,
				rotation: 10000,
			},

			connectStaus: "Finding room...",
			connectStausCode: 400,
		}

		/*- Binds -*/
		this.make_notice = this.make_notice.bind(this);
		this.leave_room = this.leave_room.bind(this);
		this.start_room = this.start_room.bind(this);
		this.update_usercache = this.update_usercache.bind(this);
		this.GetUserVal = this.GetUserVal.bind(this);
		this.onKickStateChange = this.onKickStateChange.bind(this);
	}

	/*- Backend server URL handling -*/
	_server_handler = new ServerHandler();
	_server_url     = this._server_handler.get_url();
	_server_cdn     = this._server_handler.get_cdn();

	/*- The websocket client -*/
	client = new W3CWebSocket(this._server_url);

	/*- Navigation -*/
	_navigation = this.props.navigation;
	_is_mounted = false;

	/*- Make a notice -*/
	make_notice = (notice) => {
		this.setState({
			notice,
			noticeEnabled: true,
		});
	}

	/*- UserCache functions -*/
	GetUserVal = (suid, key) => {
		try{
			return this.state.UserCache[suid].data[key];
		}catch {
			return null;
		}
	}

	/*- When the user wants to leave -*/
	leave_room = () => {
		this._is_mounted = false;

		try {
			const { suid, roomid } = this.state;

			/*- Leave the room -*/
			this.client.send(JSON.stringify({
				type: "leave",
				data: {
					suid,
					roomid,
				}
			}));

		}catch(e){ console.log(e) };
		this._navigation.navigate("Home");
	}

	/*- Only leaders should be able to do this, so check in frontend & backend -*/
	start_room = async () => {
		if (!this.state.isHost) return;
		const suid = this.state.suid;

		/*- Send the start req to the backend -*/
		this.client.send(JSON.stringify({
			type: "start",
			data: {
				requester: suid,
				roomid: this.state.roomid,
			}
		}));
	}

	/*- Update the user cache on demand -*/
	update_usercache = async (users, callback) => {

		/*- Loop through every user and check if it's in the map -*/
		users.forEach((user, index) => {
			const is_last = index === users.length - 1;

			/*- If we can't find the suid key -*/
			if (!this.state.UserCache[user]) {
				/*- Add it to the map -*/
				fetch(`${this._server_cdn}/api/profile-data`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
						suid: user,
					},
				}).then(res => res.json()).then(data => {
					this.setState({
						UserCache: {
							...this.state.UserCache,
							[user]: data,
						},
					}, () => {
						if (is_last && callback) callback();
					});
				});
			};
		});
	};

	/*- When the kick button gets a state change like rotation or scale -*/
	onKickStateChange = (e) => {
		const { rotation } = e;

		/*- Change the state -*/
		this.setState({
			kickUserButton: {
				...this.state.kickUserButton,
				rotation: rotation,
			},
		});
	}

	/*- On mount -*/
	componentDidMount = () => {
		this._is_mounted = true;
		
		/*- Join a lobby -*/
		(async () => {
			this.setState({ suid: await AsyncStorage.getItem("suid") });

			/*- Get the users suid which is needed for joining lobbies -*/
			const suid = this.state.suid;

			/*- If connecting to backend failed, try again -*/
			const retry_connect = (n) => {

				/*- We want to try to connect a set number of times -*/
				if (n > 0) {
					this.setState({
						connectStaus: `Failed to connect to servers, retrying (${MAX_POLLING-n+1}/${MAX_POLLING})`,
						connectStausCode: 403
					});

					/*- Try again in x millis -*/
					setTimeout(() => {
						if (!this._is_mounted) return;
						else request_backend(n-1);
					}, 500);
				}else{
					this.setState({
						connectStaus: "Failed to connect to servers.",
						connectStausCode: 404,
					});
				}
			}
			
			/*- Join / create a room and retry a set number of times -*/
			const request_backend = async (n) => {

				if (!this._is_mounted) return;

				/*- Try find a room -*/
				await fetch(`${this._server_url}/api/join-room`, {
					method: "GET",
					headers: { suid }
				}).then(async data => await data.json()).then(result => {

					/*- The result data -*/
					const data = result.data;

					/*- Update all variables -*/
					if (this._is_mounted) this.setState({
						users: data.users,
						roomFound: true,
						isHost: result.data.host === suid,
						roomid: data.roomid,
					}, () => {
						this.update_usercache(this.state.users);
					});

					/*- Make a websocket request to the game id -*/
					try{
						return wss_connect(5);
					}catch { retry_connect(n) };
				}).catch(() => retry_connect(n));
			}

			/*- Conenct to the websocket -*/
			const wss_connect = (n) => {
				if (!this._is_mounted) return;
				if (n <= 0) return;

				/*- If the client is ready -*/
				if (this.client.readyState === WebSocket.OPEN) {
					this.setState({
						connectStaus: "Connected to servers.",
						connectStausCode: 200,
					});
				}else{
					/*- If the client is not ready -*/
					this.setState({
						connectStaus: `Connecting to servers... (${n})`,
						connectStausCode: 400,	
					});
				}

				/*- Connect to the websocket -*/
				if (this.client.readyState === WebSocket.OPEN) {
					if (!this._is_mounted) return;

					/*- Send a join request -*/
					this.client.send(JSON.stringify({
						type: "join-room",
						data: {
							suid,
							roomid: this.state.roomid,
						}
					}));
				}else {
					console.log("Client not ready." + n);
					setTimeout(() => {
						wss_connect(n-1);
					}, 500);
				}
			};

			request_backend(MAX_POLLING);
		})();

		/*- Listen for messages -*/
		this.client.onmessage = async (event) => {
			const response = JSON.parse(event.data);
			const response_type = response.type;

			if (response_type === "join-room") {
				const suid = response.data.new_user;

				/*- Update the userlist -*/
				if(this._is_mounted) this.setState({ users: response.data.user_list }, () => {
					this.update_usercache(this.state.users, () => {
						/*- Notify all users -*/
						if(this._is_mounted) this.make_notice(`${this.state.UserCache[suid].data.username} joined the room.`);
					});
				});
				

			}else if (response_type === "start") {

				/*- Pass the roomid as a prop -*/
				this._navigation.navigate("Chat", {
					roomid: this.state.roomid,
					suid: this.state.suid,
					userCache: this.state.UserCache,
				});

			}else if (response_type === "leave") {
				const { user_list, new_host, leaver } = response.data;
				const suid = this.state.suid;

				/*- Update the userlist -*/
				if (this._is_mounted) this.setState({ users: user_list });

				/*- Notify all users -*/
				if (this._is_mounted) this.make_notice(`User {${leaver}} left!`);

				/*- If the user left was the host -*/
				if (new_host == suid) {
					if (this._is_mounted) this.setState({ isHost: true });
				}
			}
		};

		/*- If there are any errors, make somethin in the furure -*/
		this.client.onerror = (e) => { console.log(e) };
	};

	/*- Before unmounting -*/
	componentWillUnmount = () => {
		this._is_mounted = false;
	};

	/*- Render -*/
	render() {
		return (
			<View style={def.container}>
				<KickUser rotation={this.state.kickUserButton.rotation} />
				{
					(
						/*- If the room was found and the join request was succesfully sent -*/
						this.state.roomFound
						&& this.state.connectStausCode === 200	
					) ?
					<>
						{/*- Display the games current status -*/}
						<P>{
							this.state.users.length >= MAX_USERS
							? "Waiting for leader to start..."
							: "Waiting for people to join..."
						}</P>
						<BIGTEXT>{this.state.users && this.state.users.length}/{MAX_USERS}</BIGTEXT>

						{/*- Display the users -*/}
						<View style={styles.lobbyProfileContainer}>
							{this.state.UserCache && Object.keys(this.state.UserCache).map((key) => {
								const userData = this.state.UserCache[key];
								return (
									<UserPfp
										key={key}
										userData={userData}
										suid={this.state.suid}
										onKickStateChange={this.onKickStateChange}
										draggable={this.state.isHost && this.state.suid !== key}
									/>
								);
							})}
						</View>

						{/*- The admin will recieve an X button in the top left instead of
							the cancel button because it's replaced with the start one -*/}
						{ this.state.isHost
							? <StartButton onPress={this.start_room} inactive={this.state.users.length < MIN_USERS}>Start</StartButton> 
							: <StartButton onPress={this.leave_room}>Cancel</StartButton> 
						}
						{ this.state.noticeEnabled ? <Toast text={this.state.notice} onClose={() => this.setState({ noticeEnabled: false })} /> : null }

						<BackButton onPress={() => {
							this.leave_room();
						}} />
					</>
					:
					<>
						{/*- Display the current connection status -*/}
						<P>{this.state.connectStaus}</P><P />

						{/*- If the spinner should be active or not -*/}
						{this.state.connectStausCode != 404 ? <ActivityIndicator /> : null}
						<StartButton onPress={this.leave_room}>Cancel</StartButton> 
					</>
				}
			</View>
		);
	}
}

export default Lobby;