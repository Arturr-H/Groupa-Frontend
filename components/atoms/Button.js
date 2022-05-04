import { styles } from "../../Style";
import { TouchableOpacity, Text } from "react-native";
import React from "react";
import { Haptic } from "../../func/Haptic";

class Button extends React.PureComponent {
    constructor(props) {
        super(props);
    }
       
    /*- Render the button -*/
    render() {
        return (
            <TouchableOpacity
                style                = {styles.submitInput}
                onPress              = {() => {
                    this.props.onPress();
                    Haptic("medium");
                }}
                activeOpacity	     = {0.8}
            >
                <Text style={styles.submitInputText}>{this.props.children}</Text>
            </TouchableOpacity>
        );
    }
}
class StartButton extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    /*- Render the StartButton -*/
    render() {
        return (
            <TouchableOpacity
                style                = {[styles.startButton, this.props.inactive ? styles.inactive : styles.active]}
                onPress              = {() => {
                    if (!this.props.inactive) this.props.onPress();
                    Haptic("medium");
                }}
                activeOpacity	     = { this.props.inactive ? 1 : 0.8 }
            >
                <Text style={styles.submitInputText}>{this.props.children}</Text>
            </TouchableOpacity>
        );
    }
}


export {
    Button,
    StartButton
}