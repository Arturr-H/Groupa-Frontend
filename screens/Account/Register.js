"use strict";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, TextInput, KeyboardAvoidingView, TouchableOpacity, Text, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../Style";
import { Button } from "../../components/atoms/Button";

/*- Backend / Account api URL -*/
const URL = "https://wss.artur.red/api/";

export default class SignUp extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.accountContainer}>
				<View style={styles.logoContainer}>
					<Image source={require("../../assets/icon.png")} style={styles.logo} />
				</View>

				<KeyboardAvoidingView behavior="position" style={styles.bottomView}>
					<Button onPress={() => this.props.navigation.navigate("SignUp")}>
						Sign Up
					</Button>
					<Button onPress={() => this.props.navigation.navigate("Login")}>
						Log in
					</Button>
				</KeyboardAvoidingView>
				
				<StatusBar style="auto" />
			</View>
		);
	}
}
