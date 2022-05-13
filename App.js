import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useFonts } from "expo-font";

/*- Account-related scenes -*/
import Login from "./screens/Account/Login";
import SignUp from "./screens/Account/SignUp";
import Register from "./screens/Account/Register";

/*- Mains -*/
import Home from "./screens/Main/Home";
import Lobby from "./screens/Main/Lobby";
import Chat from "./screens/Main/Chat";
import Profile from "./screens/Main/Profile";

/*- Create the stack navigator -*/
const Stack = createNativeStackNavigator();

/*- Needs to be called App -*/
export default function App() {

	const [loaded] = useFonts({
		"PoppinsBold": require("./assets/fonts/Poppins-Bold.ttf"),
	});
	if (!loaded) return null;

    return (
		<React.Fragment>
			<NavigationContainer>
				<Stack.Navigator>
					{/* <Stack.Screen name = "Home" component = {Home} options = {{ headerShown: false, gestureEnabled: false }}/> */}
				
					{/*- Account related -*/}
					<Stack.Screen name = "Register" component = {Register} options = {{ headerShown: true, headerTransparent: true, headerTitle: "", headerBackTitle: "" }}/>
					<Stack.Screen name = "SignUp" component   = {SignUp} options   = {{ headerShown: true, headerTransparent: true, headerTitle: "", headerBackTitle: "Back" }}/>
					<Stack.Screen name = "Login" component    = {Login} options    = {{ headerShown: true, headerTransparent: true, headerTitle: "", headerBackTitle: "Back" }}/>

					{/*- Mains -*/}
					{/*- We set gestureEnabled to false, because the
						 users shouldn't be able to swipe back to login -*/}
					<Stack.Screen name="Home" component={Home} options={{ headerShown: false, gestureEnabled: false }}/>
					<Stack.Screen name = "Lobby" component   = {Lobby} options   = {{ headerShown: false, gestureEnabled: false }}/>
					<Stack.Screen name = "Chat" component    = {Chat} options    = {{ headerShown: false, gestureEnabled: false }}/>
					<Stack.Screen name = "Profile" component = {Profile} options = {{ headerShown: false, gestureEnabled: true }}/>

				</Stack.Navigator>
			</NavigationContainer>
		</React.Fragment>
    );
}