import { styles as style } from "../../Style";
import { View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { Camera as ExpoCam } from "expo-camera";
import { BlurView } from "expo-blur";
const styles = style.camera;

export function Camera() {
    /*- Permission vairables -*/
    const [hasPermission, setHasPermission] = React.useState(null);
    const [type, setType] = React.useState(ExpoCam.Constants.Type.back);

    React.useEffect(() => {
        (async () => {
            /*- Wait for access -*/
            const { status } = await ExpoCam.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    /*- Check if the end user gave the app permissions -*/
    if (hasPermission === null) return <View />;
    if (hasPermission === false) return <Text>No access to camera</Text>;

    /*- Render -*/
    return (
        <View style={styles.cameraContainer}>
            <ExpoCam style={styles.camera} type={type} />
            <TouchableOpacity
                style={styles.flipButtonContainer}
                onPress={() => {
                    setType(
                        type === ExpoCam.Constants.Type.back
                            ? ExpoCam.Constants.Type.front
                            : ExpoCam.Constants.Type.back
                    );
                }}>
                    <BlurView tint="dark" style={styles.flipButton}>
                        <Text style={styles.flipText}> Flip </Text>

                    </BlurView>
            </TouchableOpacity>
        </View>
    );
}