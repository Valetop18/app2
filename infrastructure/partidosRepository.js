import { supabase } from "../constants/supabase";

export const partidosRepository = {

    async getPartidos() {
        const { data, error } = await supabase
            .from('partidos')
            .select('*')
        
        if (error) throw error;
        
        return data;
    },

    async savePartidoUsuario( userId, partidoId ){

        const { error } = await supabase
            .from('usuarios_partidos')
            .insert({
                user_id: userId,
                partido_id: partidoId
            })
        
        if (error) throw error;
    },

    async isSaved(userId, partidoId){
        const { data, error } = await supabase
            .from('usuarios_partidos')
            .select('id')
            .eq('user_id', userId)
            .eq('partido_id', partidoId)
            .maybeSingle();
        
        if (error) throw error;
        return !!data;
    }




}