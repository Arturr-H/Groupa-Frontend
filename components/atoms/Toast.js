import React from "react";
import { TouchableOpacity, Image, Text, Animated, Easing, Dimensions } from "react-native";
import { styles } from "../../Style";
import { Haptic } from "../../func/Haptic";

const { width, height } = Dimensions.get("window");

/*- A toast which appears from the bottom of the screen -*/
export const Toast = ({ text, duration = 3000, onClose }) => {
    /*- The animation value -*/
    const [animation] = React.useState(new Animated.Value(0));

    /*- The animation function -*/
    const animate = (toVal) => {
        Animated.timing(animation, {
            toValue: toVal,
            duration: 250,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
        }).start();
    };

    /*- Like the componentDidMount -*/
    React.useEffect(() => {
        animate(1);
        setTimeout(() => {
            animate(0);
        }, duration);
    }, []);

    /*- Render -*/
    return (
        <Animated.View
            style={[
                styles.toast,
                {
                    transform: [
                        {
                            translateY: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [styles.toast.height, -35],
                            }),
                        },
                    ],
                },
            ]}
        >
            <Text style={styles.toastText}>{text}</Text>
        </Animated.View>
    );
}
