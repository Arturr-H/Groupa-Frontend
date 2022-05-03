import React from "react";
import { TouchableOpacity, Image, Text, Animated, Easing, Dimensions } from "react-native";
import { styles } from "../../Style";
import { Haptic } from "../../func/Haptic";

const { width, height } = Dimensions.get("window");


const RNotice = (props) => {
	return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => props.press()} style={styles.notice}>
            {/* <Image source={icon} style={styles.noticeIcon} /> */}
            <Text style={styles.noticeText}>
                {props.children}
            </Text>
        </TouchableOpacity>
	);
}

/*- Make notice visible -*/
const RShowNotice = (props) => {

    const yPos = React.useRef(new Animated.Value(height/2 + 60)).current;

    const showNotice = () => {

        Haptic("light");

        Animated.timing(yPos, {
            toValue: height/2 - 40,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.elastic(1),
        }).start();
    }
    const hideNotice = () => {

        Haptic("medium");

        Animated.timing(yPos, {
            toValue: height/2 + 60,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.elastic(1),
        }).start();
    }

    React.useEffect(() => {
        if (props.enabled) showNotice();
        else hideNotice();
    }, [props.enabled]);

    return (
        <Animated.View style={[styles.noticeContainer, { transform: [{ translateY: yPos }], zIndex: 3 }]}>
            <RNotice press={hideNotice}>
                {props.children}
            </RNotice>
        </Animated.View>
    );
}


export {
    RShowNotice
};