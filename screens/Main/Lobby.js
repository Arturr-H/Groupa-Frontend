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

// TODO: Make a cache map for every SUID - to avoid unnecessary requests

// const Laobby = () => {

// 	/*- Hooks -*/
// 	const [users, setUsers]                 = React.useState([]);
// 	const [noticeEnabled, setNoticeEnabled] = React.useState(false);
// 	const [notice, setNotice]               = React.useState("");
// 	const [roomFound, setRoomFound]         = React.useState("");
// 	const [isAdmin, setIsAdmin]             = React.useState(false);
// 	let roomid = "";

// 	/*- Navigation -*/
// 	const navigation = useNavigation();

// 	/*- Make a notice -*/
// 	const make_notice = (notice) => {
// 		setNoticeEnabled(true);
// 		setNotice(notice);
// 	}

// 	/*- When the user wants to leave -*/
// 	const leave_room = () => {
// 		navigation.navigate("Home");
// 	}
// 	/*- Only leaders should be able to do this, so check in frontend & backend -*/
// 	const start_room = async () => {
// 		if (!isAdmin) return;
// 		const suid = await AsyncStorage.getItem("suid");

// 		/*- Send the start req to the backend -*/
// 		client.send(JSON.stringify({
// 			type: "start",
// 			data: {
// 				requester: suid,
// 				roomid,
// 			}
// 		}));
// 	}

// 	/*- Like the componentDidMount -*/
// 	React.useEffect(() => {
// 		let is_mounted = true;

// 		/*- Join a lobby -*/
// 		(async () => {

// 			/*- Get the users suid which is needed for joining lobbies -*/
// 			const suid = await AsyncStorage.getItem("suid");
			
// 			/*- Join / create a room -*/
// 			await fetch("https://wss.artur.red/api/join-room", {
// 				method: "GET",
// 				headers: { suid }
// 			}).then(async data => await data.json()).then(result => {

// 				/*- The result data -*/
// 				const data = result.data;

// 				/*- Update all variables -*/
// 				if (is_mounted) {
// 					setUsers(data.users);
// 					setRoomFound(true);
// 					setIsAdmin(result.data.host == suid);
// 					roomid = data.roomid;
// 				}

// 				/*- Make a websocket request to the game id -*/
// 				try{
// 					client.send(JSON.stringify({
// 						type: "join-room",
// 						data: {
// 							roomid: data.roomid,
// 							suid,
// 						}
// 					}));
// 				}catch(e) {
// 					console.log(e);
// 				};
// 			}).catch(e => {
// 				console.log(e),
// 				make_notice("Error joining lobby");
// 			});
// 		})();

// 		return () => { is_mounted = false };
// 	}, []);

// 	/*- Like componentWillUnmount -*/
// 	React.useEffect(() => {
// 		let is_mounted = true;

// 		return async () => {
// 			const suid = await AsyncStorage.getItem("suid");
			
// 			/*- Leave the room -*/
// 			if (is_mounted) client.send(JSON.stringify({
// 				type: "leave",
// 				data: {
// 					suid,
// 					roomid,
// 				}
// 			}));
// 			is_mounted = false;
// 		}
// 	}, []);

// 	/*- Listen for messages -*/
// 	client.onmessage = async (event) => {
// 		let is_mounted = true;

// 		const response = JSON.parse(event.data);
// 		const response_type = response.type;

// 		if (response_type === "join-room") {
// 			/*- Update the userlist -*/
// 			setUsers(response.data.user_list);
			
// 			/*- Notify all users -*/
// 			make_notice(`User {${response.data.new_user}} joined!`);

// 		}else if (response_type === "start") {
// 			make_notice("Start");
// 		}else if (response_type === "leave") {
// 			const { user_list, new_host, leaver } = response.data;
// 			const suid = await AsyncStorage.getItem("suid");

// 			console.log("baen");

// 			/*- Update the userlist -*/
// 			if (is_mounted) setUsers(user_list);

// 			console.log(1);

// 			/*- Notify all users -*/
// 			if (is_mounted) make_notice(`User {${leaver}} left!`);

// 			console.log(2);

// 			/*- If the user left was the host -*/
// 			if (new_host == suid) {
// 				if (is_mounted) setIsAdmin(true);
// 				console.log(3);
// 			}
// 		}

// 		return () => { is_mounted = false };
// 	};

// 	/*- If there are any errors, make somethin in the furure -*/
// 	client.onerror = () => { make_notice("There was an error"); };

// 	/*- Render -*/
// 	return (
// 		<View style={styles.container}>
// 			{
// 				roomFound ?
// 				<>
// 					{/*- Display the games current status -*/}
// 					<P>{
// 						users.length >= MAX_USERS
// 						? "Waiting for leader to start..."
// 						: "Waiting for people to join..."
// 					}</P>
// 					<BIGTEXT>{users && users.length}/{MAX_USERS}</BIGTEXT>

// 					<View style={styles.lobbyProfileContainer}>
// 						{users && users.map((user, index) => {
// 							return <Image key={index} source={{ uri: `https://artur.red/api/profile-data/image/${user}`}} style={styles.lobbyProfileImage} />
// 						})}
// 					</View>

// 					{/*- The admin will recieve an X button in the top left instead of
// 						the cancel button because it's replaced with the start one -*/}
// 					{ isAdmin
// 						? <StartButton onPress={start_room} inactive={users.length < MIN_USERS}>Start</StartButton> 
// 						: <StartButton onPress={leave_room}>Cancel</StartButton> 
// 					}
// 					{ noticeEnabled ? <Toast text={notice} /> : null }
// 				</>
// 				:
// 				<>
// 					<P>Finding room...</P><P />
// 					<ActivityIndicator />
// 				</>
// 			}
// 		</View>
// 	);
// }
class Lobby extends React.PureComponent {

	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			users: [],
			noticeEnabled: false,
			notice: "",
			roomFound: "",
			isAdmin: false,
			roomid: ""
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

	/*- Make a notice -*/
	make_notice = (notice) => {
		this.setState({
			notice,
			noticeEnabled: true,
		});
	}

	/*- When the user wants to leave -*/
	leave_room = () => {
		_navigation.navigate("Home");
	}
	/*- Only leaders should be able to do this, so check in frontend & backend -*/
	start_room = async () => {
		if (!this.state.isAdmin) return;
		const suid = await AsyncStorage.getItem("suid");

		/*- Send the start req to the backend -*/
		client.send(JSON.stringify({
			type: "start",
			data: {
				requester: suid,
				roomid: this.state.roomid,
			}
		}));
	}

	/*- On mount -*/
	componentDidMount = () => {
		let is_mounted = true;

		/*- Join a lobby -*/
		(async () => {

			/*- Get the users suid which is needed for joining lobbies -*/
			const suid = await AsyncStorage.getItem("suid");
			
			/*- Join / create a room -*/
			await fetch("https://wss.artur.red/api/join-room", {
				method: "GET",
				headers: { suid }
			}).then(async data => await data.json()).then(result => {

				/*- The result data -*/
				const data = result.data;

				/*- Update all variables -*/
				if (is_mounted) this.setState({
					users: data.users,
					roomFound: true,
					isAdmin: result.data.host == suid,
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
			}).catch(e => {
				console.log(e),
				this.make_notice("Error joining lobby");
			});
		})();

		/*- Listen for messages -*/
		this.client.onmessage = async (event) => {
			let is_mounted = true;

			const response = JSON.parse(event.data);
			const response_type = response.type;

			if (response_type === "join-room") {
				/*- Update the userlist -*/
				this.setState({ users: response.data.user_list });
				
				/*- Notify all users -*/
				this.make_notice(`User {${response.data.new_user}} joined!`);

			}else if (response_type === "start") {
				this.make_notice("Start");
			}else if (response_type === "leave") {
				const { user_list, new_host, leaver } = response.data;
				const suid = await AsyncStorage.getItem("suid");

				console.log("baen");

				/*- Update the userlist -*/
				if (is_mounted) this.setState({ users: user_list });

				console.log(1);

				/*- Notify all users -*/
				if (is_mounted) this.make_notice(`User {${leaver}} left!`);

				console.log(2);

				/*- If the user left was the host -*/
				if (new_host == suid) {
					if (is_mounted) this.setState({ isAdmin: true });
					console.log(3);
				}
			}

			return () => { is_mounted = false };
		};

		/*- If there are any errors, make somethin in the furure -*/
		this.client.onerror = () => { this.make_notice("There was an error"); };

		return () => { is_mounted = false };
	};

	/*- Like componentWillUnmount -*/
	componentWillUnmount = () => {
		// let is_mounted = true;

		// return async () => {
		// 	const suid = await AsyncStorage.getItem("suid");
			
		// 	/*- Leave the room -*/
		// 	if (is_mounted) client.send(JSON.stringify({
		// 		type: "leave",
		// 		data: {
		// 			suid,
		// 			roomid,
		// 		}
		// 	}));
		// 	is_mounted = false;
		// }
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
						{ this.state.isAdmin
							? <StartButton onPress={this.start_room} inactive={this.state.users.length < MIN_USERS}>Start</StartButton> 
							: <StartButton onPress={this.leave_room}>Cancel</StartButton> 
						}
						{ this.state.noticeEnabled ? <Toast text={this.state.notice} /> : null }
					</>
					:
					<>
						<P>Finding room...</P><P />
						<ActivityIndicator />
					</>
				}
			</View>
		);
	}
}

export default Lobby;