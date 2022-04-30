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

		/*- States, just like useState() -*/
		this.state = {
			username: "",
			displayname: "",
			email: "",
			password: "",

			loading: false,
		};
		/*- Refs for the inputs - useful for auto-selecting the next one in queue -*/
		this.inputNameRef = React.createRef();
		this.inputDisplaynameRef = React.createRef();
		this.inputEmailRef = React.createRef();
		this.inputPasswordRef = React.createRef();


		/*- Bind the functions -*/
		this.signup = this.signup.bind(this);
	}

	/*- When the component is mounted -*/
	componentDidMount() {
		/*- Focus the first input -*/
		this.inputNameRef.current.focus();
	}

	/*- When the component is unmounted -*/
	componentWillUnmount() {
		/*- Clear the inputs -*/
		this.setState({
			username: "",
			displayname: "",
			email: "",
			password: "",
		});
	}

	/*- signup -*/
	signup = async () => {

		/*- Check if the email and password are valid -*/
		if (this.state.email.length == 0) {
			alert("Please enter your email.");
			return;
		}else if (this.state.password.length == 0) {
			alert("Please enter your password.");
			return;
		}

		/*- Show that the request is being processed -*/
		this.setState({ loading: true });

		/*- Send the request to the backend -*/
		let response = await fetch(URL + "create-account", {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				email: this.state.email,
				password: this.state.password,
			},
		});

		/*- Check if the request was successful -*/
		if (response.status == 200) {
			/*- Get the response -*/
			let responseJson = await response.json();

			console.log(responseJson)
			/*- The request can be 200 but the response code might be 400, becuase password / email was incorrect -*/
			if(responseJson.status == 200 ){
				/*- Save the token to the device -*/
				await AsyncStorage.setItem("token", responseJson.data.uid);

				/*- Navigate to the home screen -*/
				this.props.navigation.navigate("Home");
			}else{
				alert(responseJson.message);
			}

			/*- Hide the loading indicator -*/
			this.setState({ loading: false });
		} else {
			/*- Show the error -*/
			alert("Server error.");

			/*- Hide the loading indicator -*/
			this.setState({ loading: false });
		}
	}

	render() {
		return (
			<View style={styles.accountContainer}>
				<View style={styles.logoContainer}>
					<Image source={require("../../assets/icon.png")} style={styles.logo} />
				</View>

				{/*- Dodge the built-in keyboard -*/}
				<KeyboardAvoidingView behavior="position" style={styles.bottomViewLarge}>
					{/*- Username input -*/}
					<TextInput
						style                = {styles.input}
						placeholder          = {"Name..."}
						autoCapitalize       = {"none"}
						autoComplete         = {"username"}
						autoCorrect          = {false}
						spellCheck           = {false}
						keyboardType         = {"default"}
						returnKeyType        = {"next"}
						onSubmitEditing      = {() => this.inputDisplaynameRef.current.focus()}
						onChangeText         = {(text) => this.setState({ username: text })}
						value                = {this.state.username}
						ref                  = {this.inputNameRef}
					/>

					{/*- Displayname input -*/}
					<TextInput
						style                = {styles.input}
						placeholder          = {"Displayname..."}
						autoCapitalize       = {"none"}
						autoComplete         = {"name"}
						autoCorrect          = {false}
						spellCheck           = {false}
						keyboardType         = {"default"}
						returnKeyType        = {"next"}
						onSubmitEditing      = {() => this.inputEmailRef.current.focus()}
						onChangeText         = {(text) => this.setState({ displayname: text })}
						value                = {this.state.displayname}
						ref                  = {this.inputDisplaynameRef}
					/>
					
					{/*- Email input -*/}
					<TextInput
						style                = {styles.input}
						placeholder          = {"Email..."}
						autoCapitalize       = {"none"}
						autoComplete         = {"email"}
						autoCorrect          = {false}
						spellCheck           = {false}
						keyboardType         = {"email-address"}
						returnKeyType        = {"next"}
						onSubmitEditing      = {() => this.inputPasswordRef.current.focus()}
						onChangeText         = {(text) => this.setState({ email: text })}
						value                = {this.state.email}
						ref                  = {this.inputEmailRef}
					/>

					{/*- Password input -*/}
					<TextInput
						style                = {styles.input}
						placeholder          = {"Password..."}
						autoCapitalize       = {"none"}
						autoComplete         = {"password"}
						autoCorrect          = {false}
						spellCheck           = {false}
						keyboardType         = {"default"}
						returnKeyType        = {"next"}
						secureTextEntry      = {true}
						onChangeText         = {(text) => this.setState({ password: text })}
						value                = {this.state.password}
						ref                  = {this.inputPasswordRef}
					/>

					<Button onPress={this.signup}>
						{
							this.state.loading
								? <ActivityIndicator />
								: "Sign Up"
						}
					</Button>
				</KeyboardAvoidingView>
				
				<StatusBar style="auto" />
			</View>
		);
	}
}
