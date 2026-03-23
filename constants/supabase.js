import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = 'https://actpgswqzlepbudceaaa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdHBnc3dxemxlcGJ1ZGNlYWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTkzNjUsImV4cCI6MjA4MzQ5NTM2NX0.x_3BL4XOFmSl_qXMGje3thKsxNnO29M-QNvxyrOhQgg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});
