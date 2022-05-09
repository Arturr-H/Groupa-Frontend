import React from "react";
import { View, Animated, Easing, PanResponder } from "react-native";
import { styles as style, width, height } from "../../Style";
import { BlurView } from "expo-blur"
import { AccountBubble, Button, H2, P, HR } from "../AtomBundle";
const styles = style.input; // Modal styles lies here

const MODAL_START_Y = -100;
const MODAL_DURATION = 500;

const center = { x: -width*0.4, y: -height*0.3 };

class Modal extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            userData: {
                username: "",
                displayname: "",
            },
            drag: new Animated.ValueXY(center),
            modalRotation: new Animated.Value(0),
        };

        /*- Modal intro start animation y-value -*/
        this.modalY = new Animated.Value(MODAL_START_Y);
        this.modalO = new Animated.Value(0);

        /*- Function bindings -*/
        this.animate = this.animate.bind(this)

        /*- Modal pan responder -*/
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.state.drag.setOffset(this.state.drag.__getValue());
                this.state.drag.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: (_, gesture) => {
                const { dy, dx } = gesture;
                
                /*- Get the atan2 angle -*/
                const angle = (Math.atan2(dy, dx) - (Math.PI / 2) * 3);

                /*- Rotate the modal -*/
                this.animate(this.state.modalRotation, angle, 5);

                /*- Move the modal -*/
                this.state.drag.setValue({ x: dx, y: dy });
            },
            onPanResponderEnd: (_, gesture) => {
                const { dx, dy, vx, vy } = gesture;

                /*- Animate a lauch animation in the velocioysty direction -*/
                this.state.drag.flattenOffset();

                /*- If the velocity is high enough -*/
                if (Math.abs(vx) > 1 || Math.abs(vy) > 1) {
                    /*- Animate the modal moving to the direction -*/
                    this.animate(this.state.drag, { x: -dx*-4, y: -dy*-4 }, 900);
                    this.animate(this.modalO, 0, 900, () => {
                        this.disable();
                    });
                }else {
                    /*- Animate the modal back to the center -*/
                    this.state.drag.setValue(center);
                    this.animate(this.state.modalRotation, 0);
                }
            },
            onPanResponderRelease: () => {
                this.state.drag.flattenOffset();
            }
        });
    };

    /*- Simple animate function to avoid repetitive code [ ugly >:( ]  -*/
    animate(value, toValue, duration = MODAL_DURATION, callback) {
        Animated.timing(value, {
            toValue,
            duration: duration,
            useNativeDriver: true,
            easing: Easing.bezier(0.165, 0.84, 0.44, 1.0)
        }).start();

        setTimeout(() => {
            if (callback) callback();
        }, duration);
    };

    /*- Enable / disable functions -*/
    enable() {
        this.animate(this.modalY, -height * 0.3);
        this.animate(this.modalO, 1);
    };
    disable(with_anim = false) {

        /*- If closing animation should be on -*/
        if(with_anim) {
            this.animate(this.modalY, MODAL_START_Y);
            this.animate(this.modalO, 0);

            /*- Wait for the anim to finish then close it -*/
            setTimeout(() => {
                this.props.onClose();
            }, MODAL_DURATION);
        }else {
            this.props.onClose();
        }
    };

    /*- Before init -*/
    componentDidMount() {
        this.setState({ userData: this.props.data || {} });

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
                    // { translateX: -width*0.4 },
                    // { translateY: this.modalY }
                    { translateX: this.state.drag.x },
                    { translateY: this.state.drag.y },
                    { rotate: this.state.modalRotation },
                    { scale: this.modalO }
                ],
                opacity: this.modalO,
            }]}
                {...this.panResponder.panHandlers}
            >
                <BlurView intensity={100} style={styles.modal} tint={"default"}>
                    <View style={styles.modalHeader}>
                        <View style={{ flex: 1 }}>
                            <H2>{this.state.userData.displayname}</H2>
                            <P>@{this.state.userData.username}</P>
                        </View>
                        <AccountBubble style={{ flex: 1 }} src={this.state.userData.profile} onPress={() => { }} />
                    </View>

                    <HR />

                    <P>
                        ”Dolor nostrud minim et ad exercitation exercitation minim non laborum commodo veniam. Ipsum reprehenderit incididunt aliqua cupidatat cillum incididunt ipsum esse nostrud do. Pariatur magna adipisicing ad quis nisi ex aliqua deserunt enim laboris deserunt. Esse in cillum culpa id Lorem. Lorem irure ut incididunt nostrud non dolor exercitation dolor ea. Culpa do irure ut Lorem.”
                    </P>

                    <HR margin={true} />
                    <HR />

                    <Button style={{ marginBottom: 10 }} onPress={() => this.props.onAddFriend(this.state.userData.suid)}>Add friend</Button>
                    <Button hollow={true} style={{ marginBottom: 0 }} onPress={() => {
                        this.disable(true);
                    }}>Cancel</Button>
                </BlurView>
            </Animated.View>
        );
    };
}

export {
    Modal
}