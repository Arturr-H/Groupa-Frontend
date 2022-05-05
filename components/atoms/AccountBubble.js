import { def as styles } from "../../Style";
import { TouchableOpacity, Image } from "react-native";
import React from "react";

class AccountBubble extends React.PureComponent {
    constructor(props) {
        super(props);
    }
       
    /*- Render the Account bubble -*/
    render() {
        return (
            <TouchableOpacity
                style                = {styles.accountBubble}
                onPress              = {() => this.props.onPress()}
                activeOpacity	     = {0.8}
            >
                <Image
                    style                = {styles.accountBubbleImage}
                    source               = {{ uri:this.props.src || undefined }}
                />
            </TouchableOpacity>
        );
    }
}

export {
    AccountBubble
}