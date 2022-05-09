import React from "react";
import { View, Animated, Easing } from "react-native";
import { styles as style, width, height } from "../../Style";
import { BlurView } from "expo-blur"
import { AccountBubble, Button, H2, P, HR } from "../AtomBundle";
const styles = style.input; // Modal styles lies here

const MODAL_START_Y = -100;
const MODAL_DURATION = 500;

class Modal extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            userData: {
                username: "",
                displayname: "",
            },
        };

        /*- Modal intro start animation y-value -*/
        this.modalY = new Animated.Value(MODAL_START_Y);
        this.modalO = new Animated.Value(0);

        /*- Function bindings -*/
        this.animate = this.animate.bind(this)
    };

    /*- Simple animate function to avoid repetitive code [ ugly >:( ]  -*/
    animate(value, toValue) {
        Animated.timing(value, {
            toValue,
            duration: MODAL_DURATION,
            useNativeDriver: true,
            easing: Easing.bezier(0.165, 0.84, 0.44, 1.0)
        }).start();
    };

    /*- Enable / disable functions -*/
    enable() {
        this.animate(this.modalY, -height*0.3);
        this.animate(this.modalO, 1);
    };
    disable() {
        this.animate(this.modalY, MODAL_START_Y);
        this.animate(this.modalO, 0);
    };

    /*- Before init -*/
    componentDidMount() {
        if (this.props.data) this.setState({ userData: this.props.data });

        /*- Animate it -*/
        this.enable();
    };

    /*- Before component is scrapped -*/
    // componentWillUnmount() {
    //     this.disable();
    // };

    render() {
        return (
            <Animated.View style={[styles.modalContainer, {
                transform: [
                    { translateX: -width*0.4 },
                    { translateY: this.modalY }
                ],
                opacity: this.modalO,
                
            }]}>
                <BlurView intensity={100} style={styles.modal} tint={"default"}>
                    <View style={styles.modalHeader}>
                        <View style={{ flex: 1 }}>
                            <H2>{this.state.userData.displayname}</H2>
                            <P>@{this.state.userData.username}</P>
                        </View>
                        <AccountBubble style={{ flex: 1 }} src={this.state.userData.profile} onPress={() => {}} />
                    </View>
                    
                    <HR />

                    <P>
                        ”Dolor nostrud minim et ad exercitation exercitation minim non laborum commodo veniam. Ipsum reprehenderit incididunt aliqua cupidatat cillum incididunt ipsum esse nostrud do. Pariatur magna adipisicing ad quis nisi ex aliqua deserunt enim laboris deserunt. Esse in cillum culpa id Lorem. Lorem irure ut incididunt nostrud non dolor exercitation dolor ea. Culpa do irure ut Lorem.”
                    </P>

                    <HR margin={true} />
                    <HR />


                    <Button style={{ marginBottom: 10 }} onPress={() => this.props.onAddFriend(this.state.userData.suid)}>Add friend</Button>
                    <Button hollow={true} style={{ marginBottom: 0 }} onPress={() => {
                        this.disable();

                        /*- Wait for the anim to finish then close it -*/
                        setTimeout(() => {
                            this.props.onClose();
                        }, MODAL_DURATION);
                    }}>Cancel</Button>
                </BlurView>
            </Animated.View>
        );
    };
}

export {
    Modal
}