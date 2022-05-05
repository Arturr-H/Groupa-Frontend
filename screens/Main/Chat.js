import { ScrollView, View, TextInput, KeyboardAvoidingView } from "react-native";
import { chat as styles } from "../../Style";
import React from "react";
import { BIGTEXT, P, StartButton, RShowNotice } from "../../components/AtomBundle";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const ws = new W3CWebSocket("ws://wss.artur.red/");

class Chat extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		this.state = {
			users: [],
			noticeEnabled: false,
			notice: "",
		};

		/*- Binding functions -*/
		this.makeNotice = this.makeNotice.bind(this);
	}

	/*- Make a notice -*/
	makeNotice(notice) {
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

	/*- Before render -*/
	componentDidMount() {

		/*- When the connection is established -*/
		ws.onopen = () => {

		};

		/*- Listen for messages -*/
		ws.onmessage = (event) => {

		};

		/*- If there are any errors, make somethin in the furure -*/
		ws.onerror = (error) => { this.makeNotice("There was an error"); };
	}

	render() {
		return (
			<KeyboardAvoidingView style={styles.chatContainer} behavior="padding">

				<ScrollView contentContainerStyle={styles.messageContainer}></ScrollView>
				<View style={styles.messageInputContainer}>
					<TextInput
						style={styles.messageInput}
						placeholder="Send a message..."
					/>
					<View style={styles.messageSendButton} />
				</View>
				{/* <RShowNotice enabled={this.state.noticeEnabled}>{this.state.notice}</RShowNotice> */}
			</KeyboardAvoidingView>
		);
	}
}



export default Chat;