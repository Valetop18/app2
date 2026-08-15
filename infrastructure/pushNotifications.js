import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
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

    return {
        granted: notificationsAreAllowed(requestedPermission),
        requestedNow: true,
        canAskAgain: requestedPermission.canAskAgain
    };

}

export async function registerCurrentDeviceForPushNotifications(userId){
    if(!userId){
        throw new Error("PUSH_USER_REQUERIDO")
    }

    console.log(Device.isDevice)

    if (!Device.isDevice) {
        return { status: "dispositivo-no-soportado" }
    }

    //crear canal
    console.log('canal android')
    await ensureAndroidChannel();

    const permission = await getNotificationPermission();

    if(!permission.granted){
        return {
            status: "permission-denied",
            canAskAgain: permission.canAskAgain,
            requestedNow: permission.requestedNow
        }
    }

    const projectId = 
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

    if (!projectId) {
        throw new Error("PUSH_PROJECT_ID_MISSING")
    }

    let expoPushToken;

    try {
        expoPushToken = ( await Notifications.getExpoPushTokenAsync({projectId}) ).data
    } catch (error) {
        throw new Error("PUSH_TOKEN_REQUEST_FAILED", { cause: error} );
    }

    //to-do: guardar en tabla de push tokens supabase

    //to-do: guardar push token en async storage







}