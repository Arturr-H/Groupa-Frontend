import { View, Image } from "react-native";
import { styles } from "../../Style";
import React from "react";
import { BIGTEXT, P, StartButton, Toast } from "../../components/AtomBundle";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
let noticeTimeout = null;

/*- The websocket client -*/
const client = new W3CWebSocket("ws://wss.artur.red/");

const Lobby = () => {

	/*- Hooks -*/
	const [users, setUsers]                 = React.useState([]);
	const [noticeEnabled, setNoticeEnabled] = React.useState(false);
	const [notice, setNotice]               = React.useState("");

	/*- Navigation -*/
	const navigation = useNavigation();

	/*- Make a notice -*/
	const make_notice = (notice) => {
		setNoticeEnabled(true);
		setNotice(notice);

		/*- Clear the timeout -*/
		if (noticeTimeout) {
			clearTimeout(noticeTimeout);
		}
	}

	/*- When the user wants to leave -*/
	const leave_room = () => {
		navigation.navigate("Home");
	}

	/*- Like the componentDidMount -*/
	React.useEffect(() => {
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
				if (is_mounted) setUsers(data.users);

				/*- Make a websocket request to the game id -*/
				try{
					client.send(JSON.stringify({
						type: "join-room",
						data: {
							roomid: data.roomid || "ad",
							suid,
						}
					}));
				}catch(e) {
					console.log(e);
				};
			}).catch(e => {
				console.log(e),
				make_notice("Error joining lobby");
			});
		})();

		return () => { is_mounted = false };
	}, []);

	/*- Listen for messages -*/
	client.onmessage = (event) => {
		const response = JSON.parse(event.data);

		/*- Update the userlist -*/
		setUsers(response.data.user_list);

		/*- Notify all users -*/
		make_notice(`User {${response.data.new_user}} joined!`);
	};

	/*- If there are any errors, make somethin in the furure -*/
	client.onerror = () => { make_notice("There was an error"); };

	/*- Render -*/
	return (
		<View style={styles.container}>
			<P>Waiting for people to join...</P>
			<BIGTEXT>{users && users.length}/10</BIGTEXT>

			<View style={styles.lobbyProfileContainer}>
				{
					users && users.map((user, index) => {
						return <Image key={index} source={{ uri: `https://artur.red/api/profile-data/image/${user}`}} style={styles.lobbyProfileImage} />
					})
				}
			</View>

			<StartButton onPress={leave_room}>Cancel</StartButton>
			{/* <RShowNotice enabled={noticeEnabled}>{notice}</RShowNotice> */}
		</View>
	);
}

export default Lobby;