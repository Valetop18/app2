import { createContext, useContext, useState } from "react";
import { SupabaseAuthRepository } from "../infrastructure/SupabaseAuthRepository";

const AuthContext = createContext({
    user: null,
    authError: false,
    loading: true,
    tipoAuth: null,
    setTipoAuth: () => {},
    register: () => {},
    login: () => {},
    logout: () => {},
    authRepo: null,
    setUser: () => {},
    distrito: "",
    setDistrito: () => {},
});

const authRepo = new SupabaseAuthRepository();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tipoAuth, setTipoAuth] = useState(null);
    const [distrito, setDistrito] = useState("");


    async function register(payload){
        const user = await authRepo.register(payload);
        setUser(user);
        setTipoAuth('register');
    }

    async function login(payload){
        try {
            setAuthError(false);    
            const user = await authRepo.login(payload);
            setUser(user);
            setTipoAuth('login');

        } catch (error) {
            setAuthError(true);    
        }

    }

    async function logout(){
        await authRepo.logout();
        setUser(null);
    }
     
    //iniciar sesion automatica

    return (
        <AuthContext.Provider
            value={{
                user,
                authError,
                loading,
                tipoAuth,
                setTipoAuth,
                register,
                login,
                logout,
                authRepo,
                setUser,
                distrito,
                setDistrito,
            }}
        >
            {children}

        </AuthContext.Provider>

    )

}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error('error al iniciar contexto')
    }

    return context;
}