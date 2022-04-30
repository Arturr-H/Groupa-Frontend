import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../Style";
import { TopNav } from "../../components/molecules/TopNav";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Home extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		this.state = {
			imageURL: "",
		};
	}

	/*- Before render -*/
	componentDidMount() {

		/*- Get the users profile image and render it -*/
		(async () => {
			const profile = await AsyncStorage.getItem("profile");
			
			this.setState({
				imageURL: profile
			});
		})();

	}


	render() {
		return (
			<View>
				<TopNav
					imageURL={this.state.imageURL}
				/>
			</View>
		);
	}
}
