import React from "react";
import { TouchableOpacity, Text, Animated, Easing } from "react-native";
import { toast as styles } from "../../Style";
import { Haptic } from "../../func/Haptic";
let toast_timeout = null;

/*- A toast which appears from the bottom of the screen -*/
export const Toast = ({ text, duration = 3000 }) => {
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
        Haptic("light");
        animate(1);
        toast_timeout = setTimeout(() => {
            animate(0);
        }, duration);
    }, []);

    /*- Render -*/
    return (
        <Animated.View
            style={[
                styles.toastAnimator,
                {
                    transform: [
                        {
                            translateY: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [styles.toast.height, -35],
                            }),
                        },
                    ],
                }
            ]}
        >
            <TouchableOpacity style={styles.toast} activeOpacity={0.8} onPress={() => {
                if (toast_timeout) clearTimeout(toast_timeout);
                animate(0);
            }}>
                <Text style={styles.toastText}>{text}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}
