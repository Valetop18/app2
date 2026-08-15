import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const ANDROID_CHANNEL_ID = "updates";


async function ensureAndroidChannel() {
    if (Platform.OS !== "android" ) return;

    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: "Actualizaciones",
        description: "Cuando hay nueva informacion disponible",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250]
    })

}

function notificationsAreAllowed(permission) {
    return (
        permission.granted ||
        permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    )
}

async function getNotificationPermission(){
    const existingPermission = await Notifications.getPermissionsAsync();

    if( notificationsAreAllowed(existingPermission) ){
        return {
            granted: true,
            requestedNow: false,
            canAskAgain: true
        }
    }

    if( !existingPermission.canAskAgain ){
        return {
            granted: false,
            requestedNow: false,
            canAskAgain: false
        }
    }

    const requestedPermission = await Notifications.requestPermissionsAsync();


}

export async function registerCurrentDeviceForPushNotifications(userId){
    if(!userId){
        throw new Error("PUSH_USER_REQUERIDO")
    }

    if (!Device.isDevice) {
        return { status: "dispositivo-no-soportado" }
    }

    //crear canal



}