import React from "react";
import { View, Image, Text, TextInput } from "react-native";
import { styles as style, def } from "../../Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ServerHandler } from "../../func/ServerHandler";

const styles = style.profile; /*- Profile styles lies here -*/

export default class Profile extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		this.state = {
			userData: {},
			loading: false,
		};
	}

	/*- Server handler -*/
	_server_handler = new ServerHandler();
	_server_url = this._server_handler.get_url();
	_server_cdn = this._server_handler.get_cdn();

	/*- Before render -*/
	componentDidMount() {
		/*- Get the users data -*/
		(async () => {
			/*- Get the users suid -*/
			const suid = await AsyncStorage.getItem("suid");

			try {
				/*- Get the users data from the server -*/
				await fetch(`${this._server_cdn}/api/profile-data`, {
					method: "GET",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						suid: suid,
					},
				}).then(async response => await response.json())
					.then(responseJson => {
						this.setState({
							userData: responseJson.data,
						}, () => {
							this.setState({ loading: false });
							console.log(this.state.userData);
						});
					}
				);
			} catch (error) {
				console.log(error);
			};
		})();
	}

	/*- Safe way of getting data from the userdata object -*/
	get(key) {
		if (
			this.state.userData
			&& this.state.userData[key]) {
			return this.state.userData[key];
		} else {
			return "";
		}
	};

	render() {
		/*- Get the navigation handler -*/
		const { navigation } = this.props;

		return (
			<View style={def.container}>
				<View style={styles.statContainer}>
					<Image style={styles.accountImageBig} source={{ uri: this.get("profile") || "https" }} />
					<View style={styles.statTextContainer}>
						<Text style={styles.statTopText}>{12}</Text>
						<Text style={styles.statBottomText}>Posts</Text>
					</View>
					<View style={styles.statTextContainer}>
						<Text style={styles.statTopText}>{this.state.userData.friends && this.state.userData.friends.length}</Text>
						<Text style={styles.statBottomText}>Friends</Text>
					</View>
					<View style={styles.statTextContainer}>
						<Text style={styles.statTopText}>{this.get("friends").length}</Text>
						<Text style={styles.statBottomText}>Friends</Text>
					</View>
				</View>
				<View style={[styles.accountNameContainer, { justifyContent: "center", alignItems: "center" }]}>
					<Text style={styles.accountName}>{this.get("displayname")}</Text>
					<Text style={styles.accountUsername}>@{this.get("username")}</Text>
					<TextInput value={this.get("suid")} />
				</View>
			</View>
		);
	}
}
