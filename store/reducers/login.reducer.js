import { LOGIN, SIGNUP, LOGOUT } from "../actions/login.actions";

const INITIAL_STATE = {
    token: null,
    user:null, 
};

const LoginReducer = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGNUP:
            return {
                ...state,
                token:action.token,
                user:action.user
            }
        case LOGIN:
            return {
                ...state,
                token:action.token,
                user:action.user
            }
        //case LOGIN_FIREBASE:
        return {
            ...state,
            user:action.userData
        }    
        case LOGOUT:
            return {
                token:null,
                user: null
            }
        default:
            return state;
    }
}

export default LoginReducer