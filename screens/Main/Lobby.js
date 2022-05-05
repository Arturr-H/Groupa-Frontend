import { View, Image, ActivityIndicator } from "react-native";
import { styles } from "../../Style";
import React from "react";
import { BIGTEXT, P, StartButton, Toast } from "../../components/AtomBundle";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

/*- The websocket client -*/
// const client = new W3CWebSocket("ws://wss.artur.red/");
const MAX_USERS = 2;
const MIN_USERS = 2;

/*- How many times the client should try to reconnect if failed -*/
const MAX_POLLING = 5;

// TODO: Make a cache map for every SUID - to avoid unnecessary requests
class Lobby extends React.PureComponent {

	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			users: [],
			noticeEnabled: false,
			notice: "",
			roomFound: "",
			isHost: false,
			roomid: "",
			suid: "",

			connectStaus: "Finding room...",
			connectStausCode: 400,
		}

		/*- Binds -*/
		this.make_notice = this.make_notice.bind(this);
		this.leave_room = this.leave_room.bind(this);
		this.start_room = this.start_room.bind(this);
	}

	/*- The websocket client -*/
	client = new W3CWebSocket("ws://wss.artur.red/");

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

	/*- On mount -*/
	componentDidMount = () => {
		this._is_mounted = true;
		
		/*- Join a lobby -*/
		(async () => {
			this.setState({ suid: await AsyncStorage.getItem("suid") });

			/*- Get the users suid which is needed for joining lobbies -*/
			const suid = this.state.suid;
			
			/*- Join / create a room and retry a set number of times -*/
			const request_backend = async (n) => {

				if (!this._is_mounted) return;

				/*- Try find a room -*/
				await fetch("https://wss.artur.red/api/join-room", {
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
					});

					/*- Make a websocket request to the game id -*/
					try{
						this.client.send(JSON.stringify({
							type: "join-room",
							data: {
								roomid: data.roomid,
								suid,
							}
						}));
					}catch(e) {
						console.log(e);
					};
				}).catch(() => {

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
				});
			}
			request_backend(MAX_POLLING);
		})();

		/*- Listen for messages -*/
		this.client.onmessage = async (event) => {
			const response = JSON.parse(event.data);
			const response_type = response.type;

			if (response_type === "join-room") {
				/*- Update the userlist -*/
				if(this._is_mounted) this.setState({ users: response.data.user_list });
				
				/*- Notify all users -*/
				if(this._is_mounted) this.make_notice(`User {${response.data.new_user}} joined!`);

			}else if (response_type === "start") {
				this._navigation.navigate("Chat");
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
		this.client.onerror = () => { this.make_notice("There was an error"); };
	};

	/*- Like componentWillUnmount -*/
	componentWillUnmount = () => {
		this._is_mounted = false;
	};

	/*- Render -*/
	render() {
		return (
			<View style={styles.container}>
				{
					this.state.roomFound ?
					<>
						{/*- Display the games current status -*/}
						<P>{
							this.state.users.length >= MAX_USERS
							? "Waiting for leader to start..."
							: "Waiting for people to join..."
						}</P>
						<BIGTEXT>{this.state.users && this.state.users.length}/{MAX_USERS}</BIGTEXT>

						<View style={styles.lobbyProfileContainer}>
							{this.state.users && this.state.users.map((user, index) => {
								return <Image key={index} source={{ uri: `https://artur.red/api/profile-data/image/${user}`}} style={styles.lobbyProfileImage} />
							})}
						</View>

						{/*- The admin will recieve an X button in the top left instead of
							the cancel button because it's replaced with the start one -*/}
						{ this.state.isHost
							? <StartButton onPress={this.start_room} inactive={this.state.users.length < MIN_USERS}>Start</StartButton> 
							: <StartButton onPress={this.leave_room}>Cancel</StartButton> 
						}
						{ this.state.noticeEnabled ? <Toast text={this.state.notice} /> : null }
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