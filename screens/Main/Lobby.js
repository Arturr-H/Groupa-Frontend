import { View, ScrollView, Image, Text, RefreshControl } from "react-native";
import { styles } from "../../Style";
import React from "react";
import { BIGTEXT } from "../../components/AtomBundle";

export default class Lobby extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		this.state = {
			users: [],
		};
	}

	/*- Before render -*/
	componentDidMount() {

		/*- Find a lobby -*/
		//... todo

		/*- Get the people in the lobby -*/
		//... todo
	}

	render() {

		return (
			<View style={styles.container}>
				<BIGTEXT>1/10</BIGTEXT>
			</View>
		);
	}
}
