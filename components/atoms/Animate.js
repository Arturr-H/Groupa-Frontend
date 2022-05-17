import { Easing, Animated } from "react-native";
import React from "react";

class Animate extends React.PureComponent {
    constructor(props) {
        super(props);

        /*- Animate start-values -*/
        this.state = {
            opacity: new Animated.Value(this.props.opacity || 0),
            xPos: new Animated.Value(this.props.xPos),
        };

        /*- Constants -*/
        this.delay = this.props.delay || 0;
    };

    /*- Animate -*/
    componentDidMount() {

        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
			easing: Easing.out(Easing.exp),
            delay: this.delay
        }).start();

        Animated.timing(this.state.xPos, {
            toValue: 0,
            duration: 400,
			useNativeDriver: true,
			easing: Easing.out(Easing.exp),
            delay: this.delay
        }).start();
    };
       
    /*- Render -*/
    render() {
        return (
            <Animated.View style={[this.props.style, { opacity: this.state.opacity, transform: [{ translateX: this.state.xPos }]}]} {...this.props}>
                {
                    this.props.children
                }
            </Animated.View>
        );
    }
}


export {
    Animate
}