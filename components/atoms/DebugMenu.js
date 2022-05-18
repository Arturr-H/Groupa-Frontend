import React from "react";
import { StyleSheet, Text } from "react-native";
import { BlurView } from "expo-blur";
import { theme } from "../../Style";

const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: "absolute",
        top: 0,
        height: 170,
        justifyContent: "center",
        alignItems: "center",

        paddingTop: 20,
        paddingHorizontal: 20,

        borderBottomColor: "rgba(0,0,0,0.2)",
        borderBottomWidth: 1,
    },
});
export const Debug = (props) => {
    return (
        <BlurView tint={theme} intensity={100} style={styles.container}>
            <Text>{props.children}</Text>
        </BlurView>
    );
}
