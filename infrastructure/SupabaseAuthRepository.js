import { supabase } from "../constants/supabase";

export class SupabaseAuthRepository{
    async register(payload){

        console.log('intento registro');

        const { email, password, ...profileData } = payload;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: profileData
            }

        });

        console.log('data: ', data)
        console.log('error: ', error)


        if (error) throw error;
        if (!data.user) throw Error("Usuario no creado") 
        return data.user

    }

    async login(payload){

        console.log('intento login');

        const { email, password } = payload;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log('data: ', data)
        console.log('error: ', error)

        if (error) throw error;
        if (!data.user) throw Error("Error en login") 
        return data.user

    }

    async logout(){
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
}