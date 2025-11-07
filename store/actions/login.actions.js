import { URL_AUTH_SIGNUP, URL_AUTH_LOGIN } from '../../constants/database'
import { Alert } from "react-native";
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

const errorMessages = {
    INVALID_EMAIL: 'Email inválido',
    EMAIL_EXISTS: 'Email ya se encuentra registrado',
};

export const signup = (email, password) => {
    return async dispatch => {
        try {
            const response = await fetch(URL_AUTH_SIGNUP,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken:true
                })
            });
    
            if(!response.ok) {
                const data = await response.json();
                const errorCode = data.error.message;
                const errorMessage = errorCode in errorMessages 
                    ? errorMessages[errorCode]
                    : "No se ha podido registrar"
                
                    Alert.alert(
                        'Ha ocurrido un error',
                        `${errorMessage}`,
                        [{text:'Ok'}]
                      );
                throw new Error(errorMessage);
            }
    
            const data = await response.json();
            
            dispatch({ type: SIGNUP, token: data.idToken, user: data.localId})
        } catch (error) {
            console.log(error);
        }
        
        
    }
}

export const login = (email, password) => {
    return async dispatch => {
        try {
            const response = await fetch(URL_AUTH_LOGIN,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken:true
                })
            })
    
            if(!response.ok) throw new Error("Ocurrio un error, no se pudo acceder");
    
            const data = await response.json();
            dispatch({ type: LOGIN, token: data.idToken, user:data.localId })

            return data;
        } catch (error) {
            Alert.alert(
                `${error.message}`,
                'No se pudo validar su email o contraseña ',
                [{text:'Ok'}]
              );
        }
        

    }
}



export const logout = () => {
    return({
        type:LOGOUT,
    })
}