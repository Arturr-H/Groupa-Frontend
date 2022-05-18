import { StyleSheet, Dimensions } from "react-native";

/*- Sometimes % doens't work -*/
const { width, height } = Dimensions.get("window");

/*- The current UI theme -*/
const theme = "light";

/*- All themes -*/
const themes = {
	light: {
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
			main: "#fc5e5a",
			main_inactive: "#a1a1a1",
			secondary: "#5661EB",
			green: "#2fd687",
	
			fg: "#fff",
			fg_second: "rgb(245, 245, 245)",
			fg_transparent: "rgba(230, 230, 230, 0.5)",
			fg_invisible: "#ffffff00",
			placeholder: "#ccc",
		},
		toast: {
			height: 60,
		}
	},
	dark: {
		border: {
			thick: "#262431",
			light: "#373445"
		},
		text: {
			default: "#fff",
			light: "#888",
			white: "#000",
		},
		colors: {
			main: "#fc5e5a",
			main_inactive: "#a1a1a1",
			secondary: "#5661EB",
			green: "#2fd687",
	
			fg: "#312e3c",
			fg_second: "#3a3647",
			fg_transparent: "rgba(230, 230, 230, 0.5)",
			fg_invisible: "#312e3c00",
			placeholder: "#595564",
		},
		toast: {
			height: 60,
		}
	}
};

/*- Some style-variables -*/
const stylevar = themes[theme];

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
		shadowOpacity: 0.2,
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
		backgroundColor: stylevar.colors.fg,
		alignItems: "center",
		justifyContent: "center",
	},
	accountContainer: {
		backgroundColor: stylevar.colors.fg,
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

		backgroundColor: stylevar.colors.fg_second,
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
			height: height*0.5,

			left: "50%",
			top: height*0.5,
			transform: [{ translateX: -width*0.4 }],
			opacity: 0,

			overflow: "hidden",
			borderRadius: 20,
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

		tileButtonContainer: {
			width: "100%",

			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 10,
		},
		tileButton: {
			backgroundColor: stylevar.colors.main,

			height: 50,
			flex: 1,

			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		tileButtonText: {
			color: "#fff",
			fontWeight: "bold",
			fontSize: 18,
		},

	}),

	text: StyleSheet.create({
		h1: {
			fontSize: REM(2.5),
			color: stylevar.text.default,

			fontFamily: "Inter-4"
		},
		h2: {
			fontSize: REM(1.8),
			color: stylevar.text.default,

			fontFamily: "Inter-4"
		},
		h3: {
			fontSize: REM(1.4),
			color: stylevar.text.default,
			textAlign: "center",
			width: "100%",

			fontFamily: "Inter-2"
		},
		p: {
			fontSize: REM(1),
			fontWeight: "200",
			color: stylevar.text.light,

			fontFamily: "Inter-1"
		},
		bigtext: {
			fontSize: width*0.6,
			fontWeight: "900",
			width: width*2,
			color: stylevar.colors.fg_second,
			fontFamily: "PoppinsBold",
			position: "absolute",

			textAlign: "center",
		},
		hr: {
			width: "100%",
			height: 1,
			backgroundColor: stylevar.border.light,

			marginVertical: 10,
		},
		vr: {
			width: 1,
			height: "100%",
			backgroundColor: stylevar.border.light,

			marginHorizontal: 10,
		},
		inputText: {
			color: "#fff",
			fontWeight: "bold",
			fontSize: 18,
		},
	}),

	toast: StyleSheet.create({
		toastAnimator: {
			bottom: 0,

			width: "80%",
			height: stylevar.toast.height,
			position: "absolute",
			zIndex: 10,

			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",

			borderRadius: 10,
			overflow: "hidden",

			borderColor: stylevar.border.thick,
			borderWidth: 1,
		},
		toastContainer: {
			width: "100%",
			height: 60,
			zIndex: 10,
			borderRadius: 10,

			...Default.shadow,
		},
		toast: {
			padding: 10,
			paddingHorizontal: 20,
			borderRadius: 10,

			width: "100%",
			height: "100%",

			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		toastText: {
			width: "100%",
			color: "#fff",
			fontWeight: "bold",
			fontSize: 18,

			fontFamily: "Inter-2",
		},
	}),

	chat: StyleSheet.create({
		chatContainer: {
			backgroundColor: stylevar.colors.fg,
			width,
			height,

			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
				alignItems: "center",
		},
		messageFader: {
			width,
			height: 150,

			position: "absolute",
			bottom: 0,
		},
		messageInputWidth: {
			width,
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		messageInputContainer: {
			width: width*0.85,
			height: 60,

			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",

			backgroundColor: stylevar.colors.fg,
			borderRadius: 50,

			bottom: 50,
			paddingHorizontal: 25,

			...Default.shadow,
		},
		messageInput: {
			height: "100%",
			flex: 1,
			color: stylevar.text.default,
			// backgroundColor: "red",
		},
		messageSendButton: {
			height: 35,
			aspectRatio: 1,

			opacity: 0.3,
		},

		messageContainer: {
			width,
			flexGrow: 1,
			justifyContent: "flex-end",

			paddingTop: 50,
			paddingBottom: 80,
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
		chatMessagePlaceholder: {
			backgroundColor: "gray"
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

			fontFamily: "Inter-2",
			color: stylevar.text.default,
		},
		chatMessageUserText: {
			color: stylevar.text.light,
			fontWeight: "300",
			fontSize: 13,

			marginBottom: 5,
			flexShrink: 1,

			fontFamily: "Inter-1",
		},
		chatMessageAvatar: {
			width: 40,
			height: 40,
			borderRadius: 25,
			marginRight: 10,

			backgroundColor: stylevar.colors.fg_second,
			marginTop: "auto"
		},

		chatMessageTimestampOwned: {
			color: stylevar.text.light,
			fontWeight: "300",
			fontSize: 12,
			marginLeft: "auto",

			fontFamily: "Inter-1",
		},
		chatMessageTimestamp: {
			color: stylevar.text.light,
			fontWeight: "300",
			fontSize: 12,

			marginRight: 10,

			fontFamily: "Inter-1",
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

			fontFamily: "Inter-3",
		},
		friendRowUsername: {
			fontSize: REM(0.8),
			color: stylevar.text.light,
			fontFamily: "Inter-1",
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

		lobbyPfpWrapper: {
			borderColor: stylevar.border.light,
			borderWidth: 1,
			borderRadius: 10,
			overflow: "hidden",

			marginBottom: 20,
		},
		lobbyPfpContainer: {
			display: "flex",
			flexDirection: "column",

			justifyContent: "center",
				alignItems: "center",

			textAlign: "center",
			borderRadius: 5,
		},
		lobbyProfileImage: {
			width: 50,
			height: 50,
			borderRadius: 50,

			marginHorizontal: 10,
			marginVertical: 10,

			...Default.border,
		},

		kickUserButton: {
			position: "absolute",
			top: 100,
			
			left: width/2 - 40,
			width: 80,
			height: 90,
			borderRadius: 80,

			backgroundColor: stylevar.colors.main,
		},
	}),

	profile: StyleSheet.create({
		statContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
				alignItems: "center",
	
			paddingHorizontal: 20,
		},
		statTextContainer: {
			flexDirection: "column",
			justifyContent: "center",
				alignItems: "center",
			
			flex: 1,
		},
		statTopText: { fontWeight: "800" },
		statBottomText: { fontWeight: "300" },
	
		searchContainer: {
			flexDirection: "row",
			alignItems: "center",
		},
		searchBar: {
			backgroundColor: "rgb(220, 220, 220)",
			height: 40,
			borderRadius: 10,
			paddingHorizontal: 10,
			paddingLeft: 40,
	
			width: "100%",
	
			borderColor: "rgb(210, 210, 210)",
			borderWidth: 1
		},
		searchBarIcon: {
			position: "absolute",
			zIndex: 3,
	
			marginLeft: 10,
		},

		accountImageBig: {
			width: 90,
			height: 90,
	
			backgroundColor: "rgb(220, 220, 220)",
			borderRadius: 45,
	
			marginRight: 10,
			zIndex: 0,
		},
		changeImageButton: {
			position: "absolute",
			top: 0,
			right: 0,

			width: 30,
			height: 30,
			borderRadius: 20,

			zIndex: 1,
			backgroundColor: stylevar.colors.secondary,

			display: "flex",
			justifyContent: "center",
				alignItems: "center",
		},
		changeImageButtonPlus: {
			color: "white",
			textAlign: "center",
			height: 18,
			fontWeight: "800",
		},

	}),

	camera: StyleSheet.create({
		cameraContainer: {
			width: 200,
			flex: 1,

			display: "flex",
			justifyContent: "center",
				alignItems: "center",

			left: "50%",
			transform: [{ translateX: -100 }],
		},
		camera: {
			width: 200,

			aspectRatio: 1,
			borderRadius: 100,
			overflow: "hidden",

			...Default.border,
		},
	}),
};

export {
	styles,
	def,
	stylevar,
	Default,
	height, width,
	theme,
}