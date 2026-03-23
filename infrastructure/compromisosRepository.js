import { supabase } from "../constants/supabase";


export const compromisosRepository = {

    async getCompromisosByLegislador(legisladorId){
        try {
            const {data, error} = await supabase
            .from('compromisos')
            .select(`
                id,
                descripcion,
                cumplimiento,
                legislador_id,
                categoria
            `)
            .eq("legislador_id", legisladorId)

            if(error) throw error;
            return data;
        } catch (error) {
            
        }
    }


}