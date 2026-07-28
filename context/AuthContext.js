import { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SupabaseAuthRepository } from "../infrastructure/SupabaseAuthRepository";

const USER_PROFILE_KEY = "@userProfile";

const AuthContext = createContext({
  user: null,
  authError: false,
  loading: true,
  tipoAuth: null,

  register: async () => false,
  login: async () => false,
  logout: async () => {},
  actualizarUsuario: async () => {},

  setTipoAuth: () => {},

  // Compatibilidad temporal
  setUser: () => {},
  distrito: "",
  setDistrito: () => {},

  authRepo: null,
});

const authRepo = new SupabaseAuthRepository();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tipoAuth, setTipoAuth] = useState(null);

  /**
   * Guarda solamente el perfil normalizado de la aplicación.
   *
   * No guarda access_token, refresh_token ni el objeto completo
   * entregado por Supabase.
   */
  async function guardarPerfil(usuario) {
    if (!usuario) {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
      return;
    }

    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(usuario));
  }

  async function eliminarPerfilGuardado() {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  }

  /**
   * Restaura el usuario cuando se abre la aplicación.
   *
   * 1. Revisa si existe userProfile.
   * 2. Valida la sesión real de Supabase.
   * 3. Consulta el perfil actualizado.
   * 4. Sincroniza AuthContext y AsyncStorage.
   */
  useEffect(() => {
    let componenteActivo = true;

    async function restaurarSesion() {
      try {
        setLoading(true);
        setAuthError(false);

        const perfilGuardado = await AsyncStorage.getItem(USER_PROFILE_KEY);

        if (!perfilGuardado) {
          if (componenteActivo) {
            setUser(null);
            setTipoAuth(null);
          }

          return;
        }

        // También verifica que el contenido guardado sea JSON válido.
        JSON.parse(perfilGuardado);

        const usuarioActual = await authRepo.getCurrentUser();

        if (!usuarioActual) {
          await eliminarPerfilGuardado();

          if (componenteActivo) {
            setUser(null);
            setTipoAuth(null);
          }

          return;
        }

        // Supabase y profiles son la fuente actualizada.
        await guardarPerfil(usuarioActual);

        if (componenteActivo) {
          setUser(usuarioActual);
          setTipoAuth("login");
        }
      } catch (error) {
        console.error("Error al restaurar la sesión:", error);

        await eliminarPerfilGuardado();

        if (componenteActivo) {
          setUser(null);
          setTipoAuth(null);
          setAuthError(false);
        }
      } finally {
        if (componenteActivo) {
          setLoading(false);
        }
      }
    }

    restaurarSesion();

    return () => {
      componenteActivo = false;
    };
  }, []);

  async function register(payload) {
    try {
      setAuthError(false);

      const usuarioRegistrado = await authRepo.register(payload);

      await guardarPerfil(usuarioRegistrado);

      setUser(usuarioRegistrado);
      setTipoAuth("register");

      return true;
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      if (error.message === "RUT_ALREADY_EXISTS") {
        return "RUT_ALREADY_EXISTS";
      }

      if (
        error.message === "User already registered" ||
        error.code === "user_already_exists"
      ) {
        return "EMAIL_ALREADY_EXISTS";
      }

      setAuthError(true);
      return false;
    }
  }

  async function login(payload) {
    try {
      setAuthError(false);

      const usuarioAutenticado = await authRepo.login(payload);

      await guardarPerfil(usuarioAutenticado);

      setUser(usuarioAutenticado);
      setTipoAuth("login");

      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      setAuthError(true);

      return false;
    }
  }

  /**
   * Actualiza el usuario de forma centralizada.
   *
   * Más adelante esta será la única forma permitida de modificar
   * el usuario desde las pantallas.
   */
  async function actualizarUsuario(datos) {
    if (!user) {
      console.warn(
        "No se puede actualizar el usuario porque no existe una sesión activa.",
      );

      return null;
    }

    const usuarioActualizado = {
      ...user,
      ...datos,
    };

    setUser(usuarioActualizado);
    await guardarPerfil(usuarioActualizado);

    return usuarioActualizado;
  }

  async function logout() {
    try {
      await authRepo.logout();
    } catch (error) {
      console.error("Error al cerrar la sesión de Supabase:", error);
    } finally {
      await eliminarPerfilGuardado();

      setUser(null);
      setTipoAuth(null);
      setAuthError(false);
    }
  }

  /**
   * Compatibilidad temporal con las pantallas antiguas.
   *
   * Ya no existe un estado independiente para distrito.
   * El valor siempre proviene de user.distrito.
   */

  const paisNormalizado = user?.pais?.trim().toLowerCase() ?? "";
const esChileno = paisNormalizado === "chile";
const puedeInteractuar = esChileno;

console.log("AUTH DEBUG", {
  user,
  paisOriginal: user?.pais,
  paisNormalizado,
  esChileno,
  puedeInteractuar,
});
  const distrito = user?.distrito ?? "";


  async function setDistrito(nuevoDistrito) {
    return actualizarUsuario({
      distrito: nuevoDistrito,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        esChileno,
        puedeInteractuar,
        authError,
        loading,
        tipoAuth,

        register,
        login,
        logout,
        actualizarUsuario,

        setTipoAuth,
        authRepo,

        // Compatibilidad temporal
        setUser,
        distrito,
        setDistrito,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
};
