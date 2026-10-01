import { supabase } from "../constants/supabase";

export const pushNotificationsRepository = {

    async registrarToken( {userId, expoPushToken, platform} ){
        const { data, error} = await supabase.rpc("register_push_token", {
            p_user_id: userId,
            p_expo_push_token: expoPushToken,
            p_platform: platform,
        });

        if (error) throw error;

        const registration = data?.[0]; //actualizar segun retorno rpc
        if (!registration) {
            throw new Error("PUSH_REGISTRATION_EMPTY_RESPONSE");
            
        }
        return registration;
    },

    async eliminarToken({ userId, expoPushToken}){
        if (!userId || !expoPushToken) {
            throw new Error("PUSH_DELETE_INVALID");
        }
        const { error } = await supabase
            .from("push_tokens")
            .delete()
            .eq("user_id", userId)
            .eq("expo_push_token", expoPushToken);

        if (error) throw error;
    }



}