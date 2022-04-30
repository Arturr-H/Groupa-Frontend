import { styles } from "../../Style";
import { TouchableOpacity, Text } from "react-native";
import React from "react";

class Button extends React.PureComponent {
    constructor(props) {
        super(props);
    }
       
    /*- Render the button -*/
    render() {
        return (
            <TouchableOpacity
                style                = {styles.submitInput}
                onPress              = {() => this.props.onPress()}
                activeOpacity	     = {0.8}
            >
                <Text style={styles.submitInputText}>{this.props.children}</Text>
            </TouchableOpacity>
        );
    }
}

export {
    Button
}