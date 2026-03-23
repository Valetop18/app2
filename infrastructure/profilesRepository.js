import { supabase } from "../constants/supabase";

export const profilesRepository = {


    async updateCircunscripcionAndDistrito(userId, circunscripcion, distrito ){

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    circunscripcion,
                    distrito
                })
                .eq("id", userId)
                .select()
                .single();

            
            if (error) throw error;
            
            return data;
            
        } catch (error) {
            console.error('Error actualizando circunscripcion y distrito')
            return null;
        }



    }



}