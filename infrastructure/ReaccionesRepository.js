import { supabase } from "../constants/supabase";


export const reaccionesRepository = {



    async setReaccion(userId, targetId, targetType, tipoReaccion ){

        //actualizar reacciones
        //guardar reaccion
        const {data, error} = await supabase.from('user_reacciones').upsert({
            user_id: userId,
            target_id: targetId,
            target_type: targetType,
            tipo_reaccion: tipoReaccion
        }, { onConflict: 'user_id, target_id, target_type'}).select();

        if(error) throw error;
        return data;
    },

    async getReacciones(userId, targetType ){
        const {data, error} = await supabase
        .from('user_reacciones')
        .select("target_id, tipo_reaccion")
        .eq("user_id", userId)
        .eq("target_type", targetType)

        if(error) throw error;
        return data;
    },

    async getReaccion(userId, targetId, targetType){
        const {data, error} = await supabase
        .from('user_reacciones')
        .select("tipo_reaccion")
        .eq("user_id", userId)
        .eq("target_id", targetId)
        .eq("target_type", targetType)
        .maybeSingle();

        if(error) throw error;
        return data ? data.tipo_reaccion : null;
    }




}