import React from "react";
import { View, Animated, Easing, PanResponder, Keyboard } from "react-native";
import { styles as style, width, height, stylevar } from "../../Style";
import { BlurView } from "expo-blur"
import { AccountBubble, Button, H2, H3, P, HR, TileButton, TileButtonContainer } from "../AtomBundle";
import { ServerHandler } from "../../func/ServerHandler";

const styles = style.input; // Modal styles lies here

const MODAL_START_Y = -100;
const MODAL_DURATION = 500;
const VELOCITY_MIN = 1.3;
const center = { x: -width*0.4, y: -height*0.3 };

const UserProfile = (this_) => <>
    <View style={styles.modalHeader}>
        <View style={{ flex: 1 }}>
            <H2>{this_.state.userData.displayname}</H2>
            <P>@{this_.state.userData.username}</P>
        </View>
        <AccountBubble style={{ flex: 1 }} src={this_.state.userData.profile} onPress={() => { }} />
    </View>

    <HR />

    <P>
        ”Dolor nostrud minim et ad exercitation exercitation minim non
        laborum commodo veniam. Ipsum reprehenderit incididunt aliqua
        cupidatat cillum incididunt ipsum esse nostrud do. Pariatur
        magna adipisicing ad quis nisi ex aliqua deserunt enim laboris
        deserunt. Esse in cillum culpa id Lorem. Lorem irure ut incididunt"
    </P>

    <HR margin={true} />

    <Button style={{ marginBottom: 10 }} onPress={() => this_.props.onAddFriend(this_.state.userData.suid)}>Add friend</Button>
    <TileButtonContainer>
        <TileButton pos={"left"} hollow={true} onPress={() => { }}>Vote Kick</TileButton>
        <TileButton pos={"right"} hollow={true} onPress={() => { }}>Close</TileButton>
    </TileButtonContainer>
    <Button hollow={true} style={{ marginBottom: 0 }} onPress={() => {
        this_.disable(true);
    }}>Close</Button>
</>;

const FriendRequest = (this_) => <>
    <View style={styles.modalHeader}>
        <H3>@{this_.props.data.adder} sent you a friend request!</H3>
    </View>

    <HR />

    <TileButtonContainer style={{ marginBottom: 0 }}>
        <TileButton pos={"left"} hollow={true} onPress={this_.onDecline}>Decline</TileButton>
        <TileButton pos={"right"} color={stylevar.colors.green} hollow={false} onPress={() => this_.onAccept()}>Accept</TileButton>
    </TileButtonContainer>
</>

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
            modalInteractable: true,
        };

        /*- Modal intro start animation y-value -*/
        this.modalY = new Animated.Value(MODAL_START_Y);
        this.modalO = new Animated.Value(0);

        /*- Function bindings -*/
        this.animate = this.animate.bind(this);
        this.onAccept = this.onAccept.bind(this);

        this.onFriendAccepted = this.props.onFriendAccepted;
        this.friendSuid = this.props.data.friendSuid;
        this.suid = this.props.data.suid;

        /*- Modal pan responder -*/
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.state.drag.setOffset(this.state.drag.__getValue());
                this.state.drag.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: (_, gesture) => {
                const { dy, dx, vx, vy } = gesture;
                
                /*- Get the atan2 angle -*/
                const angle = (Math.atan2(vy*10 + dy, vx*10 + dx) - (Math.PI / 2) * 3);

                /*- Set the rotation -*/
                this.state.modalRotation.setValue(angle);

                /*- Set the drag -*/
                this.state.drag.setValue({ x: dx, y: dy });

                /*- Move the modal -*/
                this.state.drag.setValue({ x: dx, y: dy });
            },
            onPanResponderEnd: (_, gesture) => {
                const { dx, dy, vx, vy } = gesture;

                /*- Animate a lauch animation in the velocioysty direction -*/
                this.state.drag.flattenOffset();
                this.state.modalRotation.flattenOffset();

                /*- If the velocity is high enough -*/
                if (Math.abs(vx) > VELOCITY_MIN || Math.abs(vy) > VELOCITY_MIN) {
                    /*- Animate the modal moving to the direction -*/
                    this.animate(this.state.drag, { x: -dx*-4, y: -dy*-4 }, 900);
                    this.animate(this.modalO, 0, 900, () => {
                        this.disable();
                    });
                }else {

                    /*- If the user drags the modal mid-animation,
                        it looks kinda funky and we don't want that -*/
                    this.setState({ modalInteractable: false });

                    /*- Animate the modal back to the center -*/
                    this.animate(this.state.drag, center, 1000, () => {
                        this.state.drag.setValue(center);
                        this.setState({ modalInteractable: true });
                    });

                    this.animate(this.state.modalRotation, -(Math.PI / 2) * 4, 1000);
                }
            },
            onPanResponderRelease: () => {
                this.state.drag.flattenOffset();
            },
        });
    };

    /*- Server handler variables -*/
	_server_handler = new ServerHandler();
	_server_url = this._server_handler.get_url();
	_server_cdn = this._server_handler.get_cdn();

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
        Keyboard.dismiss();
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

    /*- Friend request accept -*/
    onAccept = async () => {

        /*- Make the ACTUAL friend request -*/
		await fetch(this._server_cdn + "/api/add-friend", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				suid: this.suid, // The current user that wants to be friends with the other user
				friend: this.friendSuid,
			},
		}).then(async response => await response.json()).then(res => {
			if (res.status === 200) {
                this.onFriendAccepted(this.suid, this.friendSuid);
				console.log("Friend request accepted!");
			} else {
				console.log("Something went wrong...");
			}
		});

        this.disable(true);
    };

    /*- Before init -*/
    componentDidMount() {
        this.setState({ userData: this.props.data || {} });

        /*- Animate it -*/
        this.enable();
    };

    render() {
        return (
            <Animated.View pointerEvents={this.state.modalInteractable ? "auto" : "none"} style={[styles.modalContainer, {
                transform: [
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

                    {
                          this.props.type === "friend-request"
                        ? FriendRequest(this)
                        : this.props.type === "profile"
                        ? UserProfile(this)
                        : null
                    }

                </BlurView>
            </Animated.View>
        );
    };
}


export {
    Modal
}