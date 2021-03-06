import React from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { styles as style, def } from "../../Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ServerHandler } from "../../func/ServerHandler";
import { Modal } from "../../components/molecules/Modal";

const styles = style.profile; /*- Profile styles lies here -*/

export default class Profile extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		this.state = {
			userData: {},
			loading: false,

			modalEnabled: false,
			profileImageRefresh: false,
		};

		/*- Refs -*/
		this.profileImage = React.createRef();
	}

	/*- Server handler -*/
	_server_handler = new ServerHandler();
	_server_url = this._server_handler.get_url();
	_server_cdn = this._server_handler.get_cdn();

	/*- Before render -*/
	componentDidMount() {
		/*- Get the users data -*/
		this.getUdata();
	}

	/*- Get the userdata-function -*/
	async getUdata() {
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
					});
				}
			);
		}catch {};
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
					<View style={styles.accountImageBig}>
						<Image
							style={{ flex: 1, borderRadius: 100, }}
							source={{ uri: this.get("profile") || "https" }}
							refresh={this.state.profileImageRefresh}
						/>
						<TouchableOpacity
							style={styles.changeImageButton}
							activeOpacity={0.8}
							onPress={() => this.setState({ modalEnabled: true })}
						>
							<Text style={styles.changeImageButtonPlus}>+</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.statTextContainer}>
						<Text style={styles.statTopText}>{12}</Text>
						<Text style={styles.statBottomText}>Posts</Text>
					</View>
					<View style={styles.statTextContainer}>
						<Text style={styles.statTopText}>{this.get("friends").length}</Text>
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

				{ this.state.modalEnabled && <Modal type="camera" onClose={(e) => {
					this.setState({ modalEnabled: false });
					
					/*- Reload the profile image -*/
					this.setState({ profileImageRefresh: true }, () => {
						this.setState({ profileImageRefresh: false });
					});
				}} /> }
			</View>
		);
	}
}
