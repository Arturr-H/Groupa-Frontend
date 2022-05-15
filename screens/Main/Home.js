import React from "react";
import { View, ScrollView, Image, Text, RefreshControl, TouchableHighlight } from "react-native";
import { styles as style, def, stylevar } from "../../Style";
import { TopNav } from "../../components/molecules/TopNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StartButton } from "../../components/AtomBundle";
import { ServerHandler } from "../../func/ServerHandler";
import { Modal } from "../../components/molecules/Modal";

const styles = style.home; /*- Home styles lies here -*/

/*- This class takes the friends-suids as an input,
	makes a request to get the friends data -*/
class FriendGetter extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			friendsData: [],
		};

		this.getFriends = this.getFriends.bind(this);
	}

	/*- Backend server URL handling -*/
	_server_handler = new ServerHandler();
	_server_url = this._server_handler.get_url();
	_server_cdn = this._server_handler.get_cdn();

	/*- Initialization -*/
	componentDidMount() {
		this.getFriends();
	}

	/*- Fetch friends -*/
	async getFriends() {

		try{
			/*- Get the users suid so that the server knows which persons friends -*/
			const suid = await AsyncStorage.getItem("suid");

			/*- Get the friends data from the server -*/
			const response = await fetch(
				`${this._server_cdn}/api/get-friends-data`,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						suid,
					},
				}
			);
			
			const responseJSON = await response.json();
			const friendsData = responseJSON.data;

			this.setState({ friendsData });
		}catch {};
	}

	render() {
		return (
			<React.Fragment>
				{
					this.state.friendsData &&
					this.state.friendsData.map((friendData, key) => {
						return <FriendRow key={key} image={friendData.profile} displayname={friendData.displayname} username={friendData.username} />
					})
				}
			</React.Fragment>
		)
	}
}

class FriendRow extends React.PureComponent {
	constructor(props) {
        super(props);
    }

	/*- Backend server URL handling -*/
	_server_handler = new ServerHandler();
	_server_url = this._server_handler.get_url();
	_server_cdn = this._server_handler.get_cdn();

    render() {
        return (
            <TouchableHighlight onPress={() => {}} underlayColor={stylevar.border.light} style={styles.friendRow}>
				<React.Fragment>
					<View style={styles.friendRowInner}>
						<Image source={{ uri: this.props.image }} style={styles.friendRowImage}></Image>
						<View style={styles.statusBlob} />
						<View style={styles.friendRowTextContainer}>
							<Text style={styles.friendRowDisplayname}>{this.props.displayname}</Text>
							<Text style={styles.friendRowUsername}>@{this.props.username}</Text>
						</View>
					</View>

					<View style={styles.friendRowInner}>
						<Image style={{ width:25, height:25, opacity:0.2 }} source={{ uri: "https://cdn-icons-png.flaticon.com/512/860/860828.png" }} />
					</View>
				</React.Fragment>
            </TouchableHighlight>
        );
    }
}

export default class Home extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		this.state = {
			profile: "",
			friends: [],
			refreshing: false,
		};
	}

	/*- Server handler variables -*/
	_server_handler = new ServerHandler();
	_server_url = this._server_handler.get_url();
	_server_cdn = this._server_handler.get_cdn();

	/*- Before render -*/
	componentDidMount() {

		/*- Get the users profile image and render it -*/
		(async () => {
			try{
				/*- Get the users data & friends -*/
				const suid = await AsyncStorage.getItem("suid");

				const data = await fetch(`${this._server_cdn}/api/profile-data`, {
					method: "GET",
					headers: { suid },
				});

				/*- Render the friends -*/
				const json = await data.json();

				this.setState({
					friends: json.data.friends,
					profile: json.data.profile,
				});
			}catch {};
		})();
	}

	/*- Refresh the page -*/
	refresh = () => {
		this.setState({ refreshing: true });
		(async () => {
			try{
				/*- Profile img -*/
				const profile = await AsyncStorage.getItem("profile");
				this.setState({
					profile: profile
				});

				/*- Get the users friends -*/
				const suid = await AsyncStorage.getItem("suid");
				const friends = await fetch(`${this._server_cdn}/api/profile-data`, {
					method: "GET",
					headers: { suid },
				});

				/*- Render the friends -*/
				const friendsJSON = await friends.json();
				this.setState({
					friends: friendsJSON.data.friends,
					refreshing: false,
				});
			}catch {};
		})();
	}

	render() {
		/*- Get the navigation handler -*/
		const { navigation } = this.props;

		return (
			<View style={def.accountContainer}>
				<TopNav imageURL={this.state.profile} navigation={navigation} />
				<ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />}>
					<FriendGetter />
				</ScrollView>

				<StartButton
					onPress={() => navigation.navigate("Lobby")}
				>Join Lobby</StartButton>
			</View>
		);
	}
}
