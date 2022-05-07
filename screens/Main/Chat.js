import { ScrollView, View, TextInput, KeyboardAvoidingView, TouchableHighlight, Text, Image } from "react-native";
import { chat as styles, stylevar } from "../../Style";
import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { BackButton, P } from "../../components/AtomBundle";
import { ServerHandler } from "../../func/ServerHandler";

/*- Map every message to this -*/
class ChatMessage extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.user_owned = this.props.user_owned;
		this.userCache = this.props.userCache;

	}

	/*- Server handler -*/
	_server_handler = new ServerHandler();
	_server_cdn = this._server_handler.get_cdn();

	/*- Render -*/
	render() {
		return (
			<React.Fragment>
				<View style={
					/*- We want dependent styles (if message is owned or not) -*/
					this.user_owned
					? styles.chatMessageOwned
					: styles.chatMessage
				}>
					{/*- If the user "owns" the message we
						don't want to display their avatar -*/
						this.user_owned
							? null
							: <Image source={{ uri: this.userCache.profile }} style={styles.chatMessageAvatar} />
					}

					{/*- Text area -*/}
					<View style={styles.chatMessageTextArea}>
						{
							/*- Only show the username if message is not owned -*/
							this.user_owned
								? null
								: <Text style={styles.chatMessageUserText}>@{this.userCache.username}</Text>
						}
						<Text style={[
							styles.chatMessageText,
							{
								color: this.user_owned
									? stylevar.text.white
									: stylevar.text.default,
							}
						]}>
							{this.props.text}
						</Text>
					</View>
				</View>
				<Text style={
					this.user_owned
						? styles.chatMessageTimestampOwned
						: styles.chatMessageTimestamp
				}>{this.props.time}</Text>
			</React.Fragment>
		);
	}
};

/*- System messages like when someone leaves -*/
class SysMessage extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Text -*/
		this.text = this.props.text;
	}

	/*- Render -*/
	render() {
		return (
			<View {...this.props} style={styles.systemMessageContainer}>
				<P>{this.text}</P>
			</View>
		)
	};
};

/*- Main scene -*/
class Chat extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		this.state = {
			users: [],
			noticeEnabled: false,
			notice: "",
			messages: [],
			message: "",
		};

		/*- Variables -*/
		this.roomid = this.props.route.params.roomid;
		this.suid = this.props.route.params.suid;
		this.userCache = this.props.route.params.userCache;

		/*- Binding functions -*/
		this.makeNotice = this.makeNotice.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.addMessage = this.addMessage.bind(this);
		this.leaveRoom = this.leaveRoom.bind(this);

		/*- Refs -*/
		this.scrollView = React.createRef();
	};

	/*- Server handler variables -*/
	_server_handler = new ServerHandler();
	_server_url = this._server_handler.get_url();
	_server_cdn = this._server_handler.get_cdn();

	/*- The websocket client -*/
	client = new W3CWebSocket(this._server_url);

	/*- Mounting-check -*/
	_is_mounted = false;

	/*- Make a notice -*/
	makeNotice(notice) {
		this.setState({
			noticeEnabled: true,
			notice,
		});
	};

	/*- Send message -*/
	sendMessage(text) {

		/*- Check if message is invalid -*/
		if (text.length === 0) { return; };

		this.client.send(JSON.stringify({
			type: "message",
			data: {
				text,
				sender: this.suid,
				roomid: this.roomid,
				time: get_hh_mm(),
			},
		}));
	};

	/*- Add message function -*/
	addMessage(data) {

		/*- Get the data -*/
		const { text, sender, time, type } = data;

		if (this._is_mounted) {
			this.setState({
				messages: [
					...this.state.messages,
					{
						text,
						owned: sender === this.suid,
						owner: sender,
						time,
						type,
					},
				],
			});

			/*- Scroll to the bottom -*/
			this.scrollView.scrollToEnd();
		}
	};

	/*- Leave room -*/
	leaveRoom() {
		this.client.send(JSON.stringify({
			type: "leave",
			data: {
				roomid: this.roomid,
				suid: this.suid,
			},
		}));

		/*- Close the ws connection and go back -*/
		this.client.close();
		this.props.navigation.navigate("Home");
	}
	
	/*- Before render -*/
	componentDidMount() {
		this._is_mounted = true;

		/*- When the connection is established -*/
		this.client.onopen = () => {
			/*- Send the join-room -*/
			this.client.send(JSON.stringify({
				type: "join-room",
				data: {
					roomid: this.roomid,
					suid: this.suid,
				},
			}));
		};

		/*- Listen for messages -*/
		this.client.onmessage = (event) => {
			const response = JSON.parse(event.data);
			const response_type = response.type;

			/*- Check the message types -*/
			if (response_type === "message") {
				this.addMessage(response.data);
			}else if (response_type === "leave") {
				this.addMessage({
					text: "Someone left the room",
					sender: "",
					time: get_hh_mm(),
					type: "system",
				});
			}
		};

		/*- If there are any errors, make somethin in the furure -*/
		this.client.onerror = () => { this.makeNotice("There was an error"); };
	}

	/*- Before unmount -*/
	componentWillUnmount() {
		this._is_mounted = false;
		this.client.close();
	}

	render() {
		return (
			<KeyboardAvoidingView style={styles.chatContainer} behavior="padding">

				{/*- All messages here -*/}
				<ScrollView contentContainerStyle={styles.messageContainer} ref={(ref) => { this.scrollView = ref; }}>
					{this.state.messages.map((obj, index) => {
						/*- If the message comes from the system like when someone leaves -*/
						if (obj.type === "system") return <SysMessage key={index} text={obj.text} />

						/*- If the message is owned by a user -*/
						else return <ChatMessage key={index} text={obj.text} user_owned={obj.owned} time={obj.time} userCache={this.userCache[obj.owner].data} />
					})}
				</ScrollView>

				<View style={styles.messageInputContainer}>
					<TextInput
						style={styles.messageInput}
						placeholder="Send a message..."
						onChangeText={(text) => {
							this.setState({
								message: text,
							});
						}}
						value={this.state.message}

						/*- Send message when enter is pressed -*/
						onSubmitEditing={() => {
							this.sendMessage(this.state.message);
							this.setState({ message: "" });
						}}
					/>
					<TouchableHighlight onPress={() => {}} underlayColor={stylevar.colors.main} style={styles.messageSendButton}><></></TouchableHighlight>
				</View>

				<BackButton onPress={this.leaveRoom} />
			</KeyboardAvoidingView>
		);
	}
};

/*- Time functions -*/
const get_hh_mm = () => {
	const date = new Date();
	const hh = date.getHours();
	const mm = date.getMinutes();

	let end = "";
	if (hh < 10) {
		end += "0";
	}
	end += hh;
	end += ":";
	if (mm < 10) {
		end += "0";
	}
	end += mm;
	return end;
};

export default Chat;