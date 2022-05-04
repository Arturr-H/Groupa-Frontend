import { StyleSheet, Dimensions } from "react-native";

/*- Sometimes % doens't work -*/
const { width, height } = Dimensions.get("window");

/*- Some style-variables -*/
const stylevar = {
	border: {
		thick: "#ccc",
		light: "rgb(240, 240, 240)"
	},
	text: {
		default: "#000",
		light: "#999"
	},
	colors: {
		main: "#fc6b68",
		main_inactive: "#a1a1a1",
		secondary: "#8798dc",
	}
}

/*- Default styles -*/
const Default = {
	border: {
		borderColor: stylevar.border.thick,
		borderWidth: 1,
	},
	shadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: -5,
		},
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 5,
	}
}

/*- CSS units -*/
const REM = (num) => num * 16;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},

	/*- Account -*/
	accountContainer: {
		backgroundColor: "#fff",
		display: "flex",
		flexDirection: "column",

		justifyContent: "space-between",
			alignItems: "center",

		flex: 1,
		width,
		height,
	},
	bottomView: {
		backgroundColor: "#fff",

		width: width - 40,
		height: 275,

		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,

		paddingHorizontal: 20,
		paddingTop: 20,

		...Default.shadow,
	},
	bottomViewLarge: {
		backgroundColor: "#fff",

		width: width - 40,
		height: 400,

		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,

		paddingHorizontal: 20,
		paddingTop: 20,

		...Default.shadow,
	},
	input: {
		backgroundColor: "#fafafa",

		height: 50,
		width: "100%",

		padding: 15,
		borderRadius: 7.5,
		marginBottom: 20,

		...Default.border,
	},
	submitInput: {
		backgroundColor: stylevar.colors.main,

		height: 50,
		width: "100%",

		borderRadius: 7.5,
		marginBottom: 20,

		display: "flex",
		justifyContent: "center",
			alignItems: "center",
	},
	submitInputText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 18,
	},
	logoContainer: {
		flex: 1,
		display: "flex",

		justifyContent: "center",
			alignItems: "center"
	},
	logo: {
		width: REM(10),
		height: REM(10),
	},

	topnav: {
		width,
		height: 120,
		borderBottomWidth: 1,
		borderBottomColor: stylevar.border.thick,

		paddingTop: 40,
		paddingHorizontal: 15,

		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	h1: {
		fontSize: REM(2.5),
		fontWeight: "bold",
		color: stylevar.text.default,
	},
	h2: {
		fontSize: REM(2),
		fontWeight: "bold",
		color: stylevar.text.default,
	},
	p: {
		fontSize: REM(1),
		fontWeight: "200",
		color: stylevar.text.light,
	},

	accountBubble: {
		height: "70%",
		aspectRatio: 1,
		borderRadius: 50,

		...Default.border,
	},
	accountBubbleImage: {
		width: "100%",
		height: "100%",
		borderRadius: 50,
	},

	friendRow: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",

		width,
		paddingHorizontal: 20,
		paddingVertical: 10,

		borderBottomColor: stylevar.border.light,
		borderBottomWidth: 1,
	},
	friendRowInner: {
		display: "flex",
		flexDirection: "row",
	},
	friendRowImage: {
		width: 45,
		height: 45,
		borderRadius: 50,

		marginRight: 10,

		...Default.border,
	},
	friendRowTextContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
	},
	friendRowDisplayname: {
		fontSize: REM(1),
		fontWeight: "bold",
		color: stylevar.text.default,
	},
	friendRowUsername: {
		fontSize: REM(0.8),
		color: stylevar.text.light,
	},

	statusBlob: {
		width: 15,
		height: 15,
		borderRadius: 50,
		backgroundColor: "green",

		left: -2,
		bottom: -2,
		position: "absolute",

		borderColor: "white",
		borderWidth: 2,
	},

	startButton: {
		height: 50,
		width: "80%",

		borderRadius: 25,
		bottom: 40,

		position: "absolute",

		display: "flex",
		justifyContent: "center",
			alignItems: "center",
	},
	inactive: { backgroundColor: stylevar.colors.main_inactive },
	active: { backgroundColor: stylevar.colors.main, },

	bigtext: {
		fontSize: REM(4.5),
		fontWeight: "900",
		color: "rgb(70, 70, 70)",	
		fontFamily: "PoppinsBold"
	},

	toastAnimator: {
		bottom: 0,

		width: "80%",
		height: 60,
		position: "absolute",
		zIndex: 10,

		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	toast: {
		backgroundColor: stylevar.colors.secondary,
		borderRadius: 10,
		padding: 10,
		paddingHorizontal: 20,

		width: "100%",
		height: 60,
		zIndex: 10,

		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",

		...Default.shadow,
	},
	noticeIcon: {
		width: 30,
		height: 30,

		marginRight: 15,
	},
	toastText: {
		flexShrink: 1,
		color: "#fff",
		fontWeight: "bold",
		fontSize: 18,
	},


	chatContainer: {
		width,
		height,

		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
	},
	messageContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",

		width: "100%",
		flexGrow: 1,

		paddingTop: 20,
		backgroundColor: "blue"
	},
	message: {
		fontSize: REM(2),
		fontWeight: "bold",
		color: stylevar.text.default,
	},

	messageInputContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		justifyContent: "center",
	},
	messageInput: {
		backgroundColor: "#fff",
		
		height: 55,
		width: "90%",

		padding: 15,
		borderRadius: 40,
		marginBottom: 30,

		...Default.shadow,
	},
	messageSendButton: {
		backgroundColor: "#8ea7e8",
		
		height: 45,
		width: 45,

		
		borderRadius: 50,
		bottom: 35,
		position: "absolute",
		right: "6.5%",
	},

	lobbyProfileContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		flexWrap: "wrap",

		paddingHorizontal: 40,
	},
	lobbyProfileImage: {
		width: 50,
		height: 50,
		borderRadius: 50,

		marginHorizontal: 10,
		marginVertical: 10,

		...Default.border,
	},
});

export {
	styles,
	Default,
	stylevar
}