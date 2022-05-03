import React from "react";
import { View, ScrollView, Image, Text, RefreshControl } from "react-native";
import { styles } from "../../Style";
import { TopNav } from "../../components/molecules/TopNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StartButton } from "../../components/AtomBundle";

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

	/*- This function is called when the component is mounted -*/
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
				"https://artur.red/api/get-friends-data",
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

    render() {
        return (
            <View style={styles.friendRow}>
				<View style={styles.friendRowInner}>
					<Image source={{ uri: this.props.image }} style={styles.friendRowImage}></Image>
					<View style={styles.statusBlob} />
					<View style={styles.friendRowTextContainer}>
						<Text style={styles.friendRowDisplayname}>{this.props.displayname}</Text>
						<Text style={styles.friendRowUsername}>@{this.props.username}</Text>
					</View>
				</View>

				<View style={styles.friendRowInner}>
					<Text>Heisja</Text>
				</View>
            </View>
        );
    }
}

export default class Home extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		this.state = {
			imageURL: "",
			friends: [],
		};
	}

	/*- Before render -*/
	componentDidMount() {

		/*- Get the users profile image and render it -*/
		(async () => {
			try{
				/*- Profile img -*/
				const profile = await AsyncStorage.getItem("profile");
				this.setState({
					imageURL: profile
				});

				/*- Get the users friends -*/
				const suid = await AsyncStorage.getItem("suid");
				const friends = await fetch("https://artur.red/api/profile-data", {
					method: "GET",
					headers: { suid },
				});

				/*- Render the friends -*/
				const friendsJSON = await friends.json();
				this.setState({
					friends: friendsJSON.data.friends
				});
			}catch {};
		})();
	}

	render() {
		/*- Get the navigation handler -*/
		const { navigation } = this.props;

		return (
			<View style={styles.accountContainer}>
				<TopNav imageURL={this.state.imageURL} />
				<ScrollView refreshControl={<RefreshControl refreshing={false} />}>
					<FriendGetter />
				</ScrollView>

				<StartButton
					onPress={() => navigation.navigate("Lobby")}
				>Hej</StartButton>
			</View>
		);
	}
}
