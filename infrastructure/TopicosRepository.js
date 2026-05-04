import { supabase } from "../constants/supabase";

export const topicosRepository = {

    async getTopicos() {
        const { data, error } = await supabase
            .from('topicos')
            .select('*')
        
        if (error) throw error;
        
        return data;
    },

    async saveUserTopicos(userId, topicoIds) {
        const rows = topicoIds.map( id => ({
            user_id: userId,
            topico_id: id
        }))

        const { error } = await supabase
            .from('user_topicos')
            .upsert( rows, { onConflict: "user_id,topico_id", ignoreDuplicates: true } );
        
        if (error) throw error;
    }

}
