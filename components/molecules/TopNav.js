import { def as styles } from "../../Style";
import { View } from "react-native";
import React from "react";
import { H1, AccountBubble } from "../AtomBundle";

class TopNav extends React.PureComponent {
    constructor(props) {
        super(props);
    }
       
    /*- Render the TopNav -*/
    render() {
        return (
            <React.Fragment>
                <View style={styles.topnav}>
                    <H1>Friends</H1>
                    <AccountBubble
                        src={this.props.imageURL}
                        onPress={() => {}}
                    />
                </View>

            </React.Fragment>
        );
    }
}

export {
    TopNav
}