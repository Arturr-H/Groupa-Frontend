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
		light: "#999",
		white: "#fff",
	},
	colors: {
		main: "#fc6b68",
		main_inactive: "#a1a1a1",
		secondary: "#8798dc",

		fg: "#fff",
		fg_second: "rgb(245, 245, 245)"
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
			height: 10,
		},
		shadowOpacity: 0.175,
		shadowRadius: 15,
		elevation: 1,
	}
}
/*- CSS units -*/
const REM = (num) => num * 16;

/*- Default styles here -*/
const def = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
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
	topnav: {
		width,
		height: 120,
		borderBottomWidth: 1,
		borderBottomColor: stylevar.border.thick,
		paddingHorizontal: 15,

		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",

		paddingBottom: 20,
		paddingTop: 40,
	},
});

/*- All other styles go here -*/
const styles = {
	register: StyleSheet.create({
		...def,

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
	}),

	input: StyleSheet.create({
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
		hollowButton: {
			backgroundColor: "transparent",
			borderWidth: 2,
			borderColor: stylevar.colors.main,
		},
		submitInputText: {
			color: "#fff",
			fontWeight: "bold",
			fontSize: 18,
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
		active:   { backgroundColor: stylevar.colors.main, },

		backButton: {
			height: 35,
			width: 35,

			position: "absolute",
			top: 60,
			left: 20,
			opacity: 0.5,

			zIndex: 39,
		},

		modalContainer: {
			position: "absolute",

			width: width*0.8,
			height: height*0.6,

			left: "50%",
			top: "50%",
			transform: [{ translateX: -width*0.4 }, { translateY: -height*0.3 }],
			opacity: 0,

			borderRadius: 10,
			...Default.border,

			backgroundColor: "rgba(0, 0, 0, 0.025)",
			...Default.shadow,
		},
		modal: {
			width: "100%",
			height: "100%",
			borderRadius: 10,
			overflow: "hidden",

			padding: 10,
		},
		modalHeader: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",

			height: 70,
			paddingBottom: 10,
		},
	}),

	text: StyleSheet.create({
		h1: {
			fontSize: REM(2.5),
			fontWeight: "bold",
			color: stylevar.text.default,
		},
		h2: {
			fontSize: REM(1.8),
			fontWeight: "bold",
			color: stylevar.text.default,
		},
		p: {
			fontSize: REM(1),
			fontWeight: "200",
			color: stylevar.text.light,
		},
		bigtext: {
			fontSize: REM(4.5),
			fontWeight: "900",
			color: "rgb(70, 70, 70)",
			fontFamily: "PoppinsBold"
		},
		hr: {
			width: "100%",
			height: 1,
			backgroundColor: stylevar.border.light,

			marginVertical: 10,
		},
	}),

	toast: StyleSheet.create({
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
		toastText: {
			flexShrink: 1,
			color: "#fff",
			fontWeight: "bold",
			fontSize: 18,
		},
	}),

	chat: StyleSheet.create({
		chatContainer: {
			backgroundColor: stylevar.colors.fg,
			width,
			height,

			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			alignItems: "center",
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
			backgroundColor: stylevar.colors.fg_second,

			height: 55,
			width: "90%",

			padding: 15,
			paddingHorizontal: 20,
			borderRadius: 40,
			marginBottom: 30,

			paddingRight: 60,
			marginTop: 20,

			...Default.border,
		},
		messageSendButton: {
			backgroundColor: stylevar.colors.fg,

			height: 45,
			width: 45,

			borderRadius: 50,
			bottom: 35,
			position: "absolute",
			right: "6.5%",


			...Default.border,
		},

		messageContainer: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "flex-end",
			alignItems: "flex-start",
			position: "relative",

			width,
			height: "100%",

			paddingTop: 20,
			paddingHorizontal: 20,
			zIndex: 11,
		},
		chatMessageWrapper: {
			display: "flex",
			flexDirection: "row",

			marginBottom: 10,
		},
		chatMessageWrapperOwned: {
			display: "flex",
			flexDirection: "row",
			marginLeft: "auto",

			marginBottom: 10,
		},

		chatMessage: {
			backgroundColor: stylevar.colors.fg_second,

			padding: 10,
			paddingHorizontal: 15,
			paddingRight: 20,

			position: "relative",
			display: "flex",
			flexDirection: "row",

			borderRadius: 20,
			borderBottomLeftRadius: 0,

			// minWidth: 100,
			maxWidth: width * 0.7,
		},
		chatMessageOwned: {
			backgroundColor: stylevar.colors.main,

			padding: 10,
			paddingHorizontal: 15,

			position: "relative",

			display: "flex",
			flexDirection: "row",
			textAlign: "right",

			borderRadius: 20,
			borderBottomRightRadius: 0,
			// minWidth: 100,
			maxWidth: width * 0.77,
		},
		chatMessageTextArea: {
			display: "flex",
			flexDirection: "column",
			flexShrink: 1,
		},
		chatMessageText: {
			fontWeight: "400",

			flexShrink: 1,
			flexWrap: "wrap",
			lineHeight: 20,
		},
		chatMessageUserText: {
			color: stylevar.text.light,
			fontWeight: "300",
			fontSize: 13,

			marginBottom: 5,
			flexShrink: 1,
		},
		chatMessageAvatar: {
			width: 40,
			height: 40,
			borderRadius: 25,
			marginRight: 10,

			backgroundColor: "blue",
			marginTop: "auto"
		},

		chatMessageTimestampOwned: {
			color: stylevar.text.light,
			fontWeight: "300",
			fontSize: 12,
			marginLeft: "auto",
		},
		chatMessageTimestamp: {
			color: stylevar.text.light,
			fontWeight: "300",
			fontSize: 12,

			marginRight: 10,
		},

		systemMessageContainer: {
			width: "100%",
			display: "flex",
			justifyContent: "center",
				alignItems: "center",
		},

		gradientOverlay: {
			top: 0,
			left: 0,
			zIndex: 2,
			width: "100%",
			height: 100,
			position: "absolute",
		}
	}),

	home: StyleSheet.create({
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

		accountBubble: {
			height: "100%",
			aspectRatio: 1,
			borderRadius: 50,

			...Default.border,
		},
		accountBubbleImage: {
			width: "100%",
			height: "100%",
			borderRadius: 50,
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
	}),

	lobby: StyleSheet.create({
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

		lobbyPfpContainer: {
			display: "flex",
			flexDirection: "column",

			justifyContent: "center",
				alignItems: "center",

			textAlign: "center",
		},
	}),
};

export {
	styles,
	def,
	stylevar,
	Default,
	height, width,
}