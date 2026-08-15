import { supabase } from "../constants/supabase";

export class SupabaseAuthRepository {
  crearUsuario(authUser, profile = {}) {
    return {
      id: authUser.id,
      email: authUser.email ?? "",
      nombre: profile.nombre ?? authUser.user_metadata?.nombre ?? "",
      distrito: profile.distrito ?? null,
      circunscripcion: profile.circunscripcion ?? null,
      pais: profile.pais,
    };
  }

  async obtenerPerfil(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, nombre, distrito, circunscripcion, pais")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  }

  async existeRut(rut) {
    const { data, error } = await supabase.rpc("existe_rut", {
      p_rut: rut.trim(),
    });

    if (error) throw error;

    return data === true;
  }

  async register(payload) {
    console.log("intento registro");

    const { email, password, ...profileData } = payload;

    const rutExiste = await this.existeRut(profileData.rut);

    console.log("¿El RUT ya existe?:", rutExiste);

    if (rutExiste) {
      throw new Error("RUT_ALREADY_EXISTS");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profileData,
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("Usuario no creado");

    return this.crearUsuario(data.user, {
      nombre: profileData.nombre,
      distrito: null,
      circunscripcion: null,
      pais: profileData.pais,
    });
  }

  async login(payload) {
    console.log("intento login");

    const { email, password } = payload;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Error en login");

    const profile = await this.obtenerPerfil(data.user.id);

    return this.crearUsuario(data.user, profile);
  }

  async getCurrentUser() {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    if (!session?.user) {
      return null;
    }

    const profile = await this.obtenerPerfil(session.user.id);

    return this.crearUsuario(session.user, profile);
  }

  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  }
}
