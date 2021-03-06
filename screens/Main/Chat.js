import { ScrollView, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Text, Image, Keyboard } from "react-native";
import { def, styles as style, stylevar, theme } from "../../Style";
import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { BackButton, P, Toast, Animate } from "../../components/AtomBundle";
import { ServerHandler } from "../../func/ServerHandler";
import { LinearGradient } from "expo-linear-gradient";
import { Modal, showModal, closeModal } from "../../components/molecules/Modal";
import { VR } from "../../components/AtomBundle"

const styles = style.chat; /*- Home styles lies here -*/

/*- How many ms we'll wait before noticing
	the user about connection problems -*/
const CONNECTION_TIMEOUT_CHECK = 3000;

/*- Every message that is owned by the same person and
	sent within 1 minute will be merged if this is true -*/
const MERGE_MESSAGES = true;

/*- How many characters we allow as a maximum
	sending limit, it's also used to prevent
	two messages that toghether make asentence
	with more than <MAX_CHARS> chars from merging -*/
const MAX_CHARS = 500;

const TEMPORARY_CHAT_MSGS = ["Hello", "What??", "Can we talk about the political and economic state of the world right now?",
"Please add me", "What is the purpose of life, why am I here, when will I be gone? How can I be useful? And just why do I exist?",
"I am a robot, I am not a human", "Shut upppppp", "Okay sorry", "But that doesn't make any sense...?", "Answer my question",
"What is better, a cat or a dog?", "Do you think AI will take over the world?", "Nah", "Yeah probably", "Do you like me?"]

/*- Max characters per message -*/

/*- Map every message to this -*/
class ChatMessage extends React.PureComponent {
	constructor(props) {
		super(props);

		this.user_owned = this.props.user_owned;
		this.userCache = this.props.userCache;
		this.placeholder = this.props.placeholder;

		this.xPos = this.user_owned ? 200 : -200;

		this.delay = this.placeholder ? 400 : 0;
	}

	/*- Server handler -*/
	_server_handler = new ServerHandler();
	_server_cdn = this._server_handler.get_cdn();

	/*- Render -*/
	render() {
		return (
			<Animate xPos={this.xPos} delay={this.delay}>
				<View style={[
					this.user_owned
						? styles.chatMessageWrapperOwned
						: styles.chatMessageWrapper,
				]}>
					{/*- If the user "owns" the message we
						don't want to display their avatar -*/
						this.user_owned
						? null
						: <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.onProfilePress()}>
							<Image source={{ uri: this.userCache.profile }} style={styles.chatMessageAvatar} />
						</TouchableOpacity>
					}
					<View style={[
						/*- We want dependent styles (if message is owned or not) -*/
						this.user_owned
							? styles.chatMessageOwned
							: styles.chatMessage,

						this.placeholder
							? styles.chatMessagePlaceholder
							: {}
					]}>
						{/*- Text area -*/}
						<View style={styles.chatMessageTextArea}>
							{
								/*- Only show the username if message is not owned -*/
								<Text style={[styles.chatMessageUserText, 
									this.user_owned
										? { color: "white" }
										: null,

									this.user_owned
										? { textAlign: "right" }
										: { textAlign: "left" },
								]}>
									{
										this.user_owned
											? "You"
											: "@" + this.userCache.username
									} : {get_hh_mm(this.props.time)}
								</Text>
							}
							<Text style={[
								styles.chatMessageText,
								{
									color: this.user_owned
										? theme == "dark"
											? stylevar.text.default
											: stylevar.text.white
										: stylevar.text.default,

									textAlign: this.user_owned
										? "right"
										: "left",
								}
							]} numberOfLines={20}>
								{this.props.text}
							</Text>
						</View>
					</View>
				</View>
			</Animate>
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
			<Animate xPos={-200}>
				<View {...this.props} style={styles.systemMessageContainer}>
					<P>{this.text}</P>
				</View>
			</Animate>
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

			modalQueue: [],			
			// modalEnabled: false,
			// modalData: {},
			// modalType: "",
		};

		/*- Variables -*/
		this.roomid = this.props.route.params.roomid;
		this.suid = this.props.route.params.suid;
		this.userCache = this.props.route.params.userCache;

		/*- A unix time variable for knowing how long
			the client has been on without a connection -*/
		this.connection_reestablished = false;

		/*- Binding functions -*/
		this.makeNotice = this.makeNotice.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.addMessage = this.addMessage.bind(this);
		this.leaveRoom = this.leaveRoom.bind(this);
		this.submitEditing = this.submitEditing.bind(this);
		this.wsConnectionError = this.wsConnectionError.bind(this);

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

		const messageData = {
			text,
			sender: this.suid,
			roomid: this.roomid,
			time: new Date().getTime(),
			messageId: this.getMessageId(),
		};

		/*- Show a placeholder message -*/
		this.addMessage({ ...messageData }, true);

		/*- Check if message is invalid -*/
		if (text.length === 0) { return; };
		this.client.send(JSON.stringify({
			type: "message",
			data: { ...messageData },
		}));
	};
	submitEditing()	{
		this.sendMessage(this.state.message);
		this.setState({ message: "" });
	};
	/*- All messages are connected to a messageid -*/
	getMessageId() {
		/*- Just random chars -*/
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	};

	/*- Add message function -*/
	addMessage(data, is_sending = false) {

		/*- Get the data -*/
		const { text, sender, time, type, messageId } = data;

		/*- If the message is still pending, make a placholder -*/
		if(is_sending) {
			return this.setState({
				messages: [
					...this.state.messages,
					{
						text,
						owned: sender === this.suid,
						owner: sender,
						time,
						type,
						is_sending,
						messageId,
					},
				],
			});
		}else {
			/*- Remove the placeholder message -*/
			this.setState({
				messages: this.state.messages.filter(message => message.is_sending !== true),
			});
		}

		/*- if message merging was successful -*/
		let merge_success = false;
		if (this._is_mounted) {

			/*- So, message grouping -*/
			/*- We'll begin by checking if the previous
				message is owned by the current user, if so,
				we'll group these messages' texts together! -*/
			const amount_of_messages = this.state.messages.length;

			/*- Check -*/
			if (amount_of_messages > 0 && MERGE_MESSAGES) {
				const last_message = {
					text: this.state.messages[amount_of_messages - 1].text,
					owner: this.state.messages[amount_of_messages - 1].owner,
					time: this.state.messages[amount_of_messages - 1].time,
				};

				if (
					/*- If the last message is owned by the same person -*/
					last_message.owner === sender

					/*- And the message was sent within the last minute -*/
					&& (time - last_message.time) < 60 * 1000

					/*- And the messages texts' won't exceed
						the maximum char limit once meged -*/
					&& last_message.text.length + text.length <= MAX_CHARS
				) {

					merge_success = true;

					/*- We'll add the new message to the last message's text -*/
					this.setState({
						messages: [
							...this.state.messages.slice(0, amount_of_messages - 1),
							{
								text: last_message.text + "\n" + text,
								owner: sender,
								owned: sender === this.suid,
								time,
								type,
								messageId,
							},
							...this.state.messages.slice(amount_of_messages),
						],
					});
				}
			}

			/*- Otherwise, we'll add the new message to the messages array -*/
			if (!merge_success) this.setState({
				messages: [
					...this.state.messages,
					{
						text,
						owned: sender === this.suid,
						owner: sender,
						time,
						type,
						messageId,
					},
				],
			});

			/*- Scroll to the bottom -*/
			// this.scrollView.current.scrollToEnd({ animated: true });
		}

		/*- Scroll to the bottom -*/
		// if(this.scrollView) this.scrollView.current.scrollToEnd({ animated: true });
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

	/*- When a friendship is made -*/
	acceptFriendRequest(suid, friend) {
		this.client.send(JSON.stringify({
			type: "friend-accept",
			data: {
				suid,
				friend,
				roomid: this.roomid,
			},
		}));
	}

	/*- Friend adding -*/
	async sendFriendRequest(suid) {
		/*- Send a ws message to the other user that they've been added -*/
		this.client.send(JSON.stringify({
			type: "friend-request",
			data: {
				friend: suid,
				suid: this.suid,
				roomid: this.roomid,
			},
		}));

	};
	
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

			/*- Re-establish the conenction -*/
			this.connection_reestablished = true;
		};

		/*- Listen for messages -*/
		this.client.onmessage = (event) => {
			const response = JSON.parse(event.data);
			const response_type = response.type;

			/*- Check the message types -*/
			if (response_type === "message") {
				this.addMessage(response.data);
				this.addMessage({
					type: "system",
					text: `${response.data.messageId} : ${response.data.time} : ${response.data.sender} : ${response.data.roomid} : system:user`
				}, true);
			}else if (response_type === "leave") {
				this.addMessage({
					text: "Someone left the room",
					sender: "",
					time: get_hh_mm(),
					type: "system",
				});
			}else if (response_type === "friend-request") {
				const { friend, suid } = response.data;

				/*- The "adders" name -*/
				const adder = this.userCache[suid].data.username;

				/*- Check if the current user was the one who was added -*/
				if (friend == this.suid && this._is_mounted) {
					showModal(this, "friend-request", {
						adder: adder,
						friendSuid: suid,
						suid: this.suid,
					})
				}
			}else if (response_type === "friend-accept") {
				const { friend, suid } = response.data;

				/*- The "adders" name -*/
				const adder = this.userCache[suid].data.username;

				/*- Check if the current user was the one who was added -*/
				if (friend == this.suid) {
					this.makeNotice(`${adder} & you are now friends!`);
				}
			}
		};

		/*- If there are any errors, make somethin in the furure -*/
		this.client.onerror = this.wsConnectionError;
		this.client.onclose = this.wsConnectionError;

		//TODO TEMPORARY
		// setInterval(() => {
		// 	this.addMessage({
		// 		text: TEMPORARY_CHAT_MSGS[Math.floor(Math.random() * TEMPORARY_CHAT_MSGS.length)],
		// 		sender: "",
		// 		time: get_hh_mm(),
		// 	});
		// }, 8000);
	};
	
	/*- Before unmount -*/
	componentWillUnmount() {
		this._is_mounted = false;
		this.client.close();
	};

	/*- Client recieves connection problems -*/
	wsConnectionError() {
		this.connection_reestablished = false;

		/*- If the connection is still not alive after x seconds -*/
		setTimeout(() => {
			if (!this.connection_reestablished && this._is_mounted) {
				showModal(this, "connection-error", null);
			}
		}, CONNECTION_TIMEOUT_CHECK)
	};

	/*- Safe way of getting userdata without any errors -*/
	getUserData(suid) {
		if (this.userCache[suid]) {
			return this.userCache[suid].data;
		}else {
			return {};
		}
	};
	
	render() {
		return (
			<View style={def.container}>

				{/*- Top gradient-overlay -*/}
				<LinearGradient
                    colors={[stylevar.colors.fg, stylevar.colors.fg_invisible]}
                	style={styles.gradientOverlay}
                />

				{/*- Chat messages and input are here -*/}
				<KeyboardAvoidingView style={styles.chatContainer} behavior="position">

					{/*- All messages here -*/}
					<ScrollView
						horizontal={false}
						// onTouchStart={() => Keyboard.dismiss()}
						contentContainerStyle={styles.messageContainer}
						ref={(ref) => { this.scrollView = ref; }}
					>
						<ChatMessage onProfilePress={() => showModal(this, "profile", {username: "test", displayname: "testman", profile: "https"})} key={"index"} text={"Test object"} user_owned={false} time={1021281} userCache={{username: "test", displayname: "testman", profile: "https"}} />
						
						{this.state.messages.map((obj, index) => {
							/*- If the message comes from the system like when someone leaves -*/
							if (obj.type === "system") return <SysMessage key={index} text={obj.text} />

							if (obj.is_sending) return <ChatMessage placeholder={true} onProfilePress={() => showModal(this, "profile", obj)} key={index} text={obj.text} user_owned={obj.owned} time={obj.time} ids={obj.ids} userCache={{}}  />
							/*- If the message is owned by a user -*/
							else return <ChatMessage onProfilePress={() => showModal(this, "profile", this.userCache[obj.owner].data)} key={index} text={obj.text} user_owned={obj.owned} time={obj.time} ids={obj.ids} userCache={this.getUserData(obj.owner)} />
						})}
					</ScrollView>

					<LinearGradient
						style={styles.messageFader}
						colors={[stylevar.colors.fg_invisible, stylevar.colors.fg, stylevar.colors.fg]}
						locations={[0, 0.4, 1]}
					/>
					<View style={styles.messageInputWidth}>
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
								keyboardAppearance={theme}

								/*- Send message when enter is pressed -*/
								onSubmitEditing={this.submitEditing}
								maxLength={MAX_CHARS}
								placeholderTextColor={stylevar.colors.placeholder}
							/>
							<VR thick={true} height={"50%"} />
							<Image source={{ uri: "https://cdn4.iconfinder.com/data/icons/multimedia-75/512/multimedia-42-1024.png" }} style={styles.messageSendButton} />
						</View>
					</View>
				</KeyboardAvoidingView>


				{/*- Modals -*/}
				{
					/*- Get the first modal from the modalqueue -*/
					this.state.modalQueue.map((modal, index) => (
						index > 0 ? null :
						<Modal
							data={modal.data.data}
							onClose={() => closeModal(this)}
							key={modal.index}
							onAddFriend={(suid) => this.sendFriendRequest(suid)}
							type={modal.data.type}
							onFriendAccepted={(suid, friend) => this.acceptFriendRequest(suid, friend)}
						/>	
					))
				}

				{ this.state.noticeEnabled ? <Toast text={this.state.notice} /> : null }
				<BackButton onPress={this.leaveRoom} />
			</View>
		);
	};
};

/*- Time functions -*/
const get_hh_mm = (date) => {

	const time = new Date(date);

	const hh = time.getHours();
	const mm = time.getMinutes();

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