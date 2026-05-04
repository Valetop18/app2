import { supabase } from "../constants/supabase";
import { getPublicUrl } from "./legisladoresRepository";

const BUCKET_PARTIDOS = "Partidos";

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
    },

    async getPartidoById(id) {
            try {
                const { data, error } = await supabase
                .from('partidos')
                .select(`
                    id,
                    nombre,
                    sigla,
                    url_img
                `)
                .eq("id", id)
                .single();
    
                if (error) throw error;
    
                return {
                        id: data.id,
                        nombre: data.nombre,
                        sigla: data.sigla,
                        foto: getPublicUrl(data.url_img, BUCKET_PARTIDOS),
                    }
                }
    
             catch (error) {
                console.error("Error al obtener el partido: ", error.message);
                return [];
            }
        },


}