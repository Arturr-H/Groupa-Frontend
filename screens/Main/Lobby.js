import { View, Image } from "react-native";
import { styles } from "../../Style";
import React from "react";
import { BIGTEXT, P, StartButton, RShowNotice } from "../../components/AtomBundle";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ws = new W3CWebSocket("ws://wss.artur.red/");
let noticeTimeout = null;

class Lobby extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		this.state = {
			users: [],
			ws: null,
			noticeEnabled: false,
			notice: "",
		};
		
		/*- Binding functions -*/
		this.make_notice = this.make_notice.bind(this);
		this.leave_room = this.leave_room.bind(this);
	}

	/*- Make a notice -*/
	make_notice(notice) {
		this.setState({
			noticeEnabled: true,
			notice,
		});

		/*- Clear the timeout -*/
		if (noticeTimeout) {
			clearTimeout(noticeTimeout);
		}

		/*- After a couple of seconds, close the notice -*/
		noticeTimeout = setTimeout(() => {
			this.setState({
				noticeEnabled: false,
			});
		}, 4000);
	}

	/*- When the user wants to leave -*/
	leave_room() {
		
		ws.close();

		this.props.navigation.navigate("Home");
	}

	/*- Before render -*/
	componentDidMount() {

		/*- Find a lobby -*/


		/*- Get the people in the lobby -*/
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
				this.setState({ users: data.users });

				/*- Make a websocket request to the game id -*/
				ws.send(JSON.stringify({
					type: "join-room",
					utf8Data: {
						roomid: data.roomid || "ad",
						suid,
					}
				}));
			}).catch(_ => {
				this.make_notice("Error joining lobby");
			});
		})();

		// /*- When the connection is established -*/
		// ws.onopen = () => {

		// };

		// /*- Listen for messages -*/
		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);

			/*- Update the userlist -*/
			this.setState({ users: data.data });

			/*- Notify all users -*/
			this.make_notice("User joined!");
		};

		/*- If there are any errors, make somethin in the furure -*/
		ws.onerror = (error) => { this.make_notice("There was an error"); };

	}

	render() {

		return (
			<View style={styles.container}>
				<P>Waiting for people to join...</P>
				<BIGTEXT>{this.state.users && this.state.users.length}/10</BIGTEXT>

				<View style={styles.lobbyProfileContainer}>
					<Image key={"index"} source={{ uri: `https://artur.red/api/profile-data/image/${"user"}`}} style={styles.lobbyProfileImage} />
					<Image key={"inde2x"} source={{ uri: `https://artur.red/api/profile-data/image/${"user"}`}} style={styles.lobbyProfileImage} />
					<Image key={"ind42ex"} source={{ uri: `https://artur.red/api/profile-data/image/${"user"}`}} style={styles.lobbyProfileImage} />
					<Image key={"inde15x"} source={{ uri: `https://artur.red/api/profile-data/image/${"user"}`}} style={styles.lobbyProfileImage} />
					<Image key={"in1dex"} source={{ uri: `https://artur.red/api/profile-data/image/${"user"}`}} style={styles.lobbyProfileImage} />
					<Image key={"in2dex"} source={{ uri: `https://artur.red/api/profile-data/image/${"user"}`}} style={styles.lobbyProfileImage} />

					{
						this.state.users && this.state.users.map((user, index) => {
							return <Image key={index} source={{ uri: `https://artur.red/api/profile-data/image/${user}`}} style={styles.lobbyProfileImage} />
						})
					}
				</View>

				<StartButton
					onPress={this.leave_room}
				>Cancel</StartButton>

				<RShowNotice enabled={this.state.noticeEnabled}>{this.state.notice}</RShowNotice>
			</View>
		);
	}
}



export default Lobby;