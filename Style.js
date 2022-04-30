import { StyleSheet } from "react-native";

/*- Default styles -*/
const Default = {
	border: {
		borderColor: "#ccc",
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
	},
	bottomView: {
		backgroundColor: "#fff",

		width: "100%",
		height: 300,

		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,

		paddingHorizontal: 20,
		paddingTop: 20,

		...Default.shadow,
	},
	bottomViewLarge: {
		backgroundColor: "#fff",

		width: "100%",
		height: 425,

		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,

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
		backgroundColor: "#fc6b68",

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
});

export {
	styles,
	Default 
}