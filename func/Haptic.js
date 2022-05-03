import * as Haptics from "expo-haptics";
import { Platform } from 'react-native';

const UNSUPPORTED_PLATFORMS = ["web", "macos", "windows"];

const Haptic = (type) => {

    /*- Check if haptics is supported -*/
    if (UNSUPPORTED_PLATFORMS.includes(Platform.OS)) {
        return;
    }

    try{
        switch (type) {
            case "heavy":
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                break;
            
            case "medium":
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                break;
    
            case "light":
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                break;
            
            case "selection":
                Haptics.selectionAsync();
                break;

            case "notification":
                Haptics.notificationAsync();
                break;
            
            default:
                console.log(`No haptic named "${type}"`);
                break;
        }
    }catch{
        console.log("Haptic not supported.")
        return;
    }
}

export {
    Haptic,
};