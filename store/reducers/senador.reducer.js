import { SELECT_SENADOR } from '../actions/senador.action'
import { FILTERED_SENADORES } from "../actions/senador.action"

import { SENADORES } from '../../data/senadores'

const initialState = {    
    selected: null,
    senadores: SENADORES, 
    filteredSenadores: [],
}

const SenadorReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILTERED_SENADORES:
            return {
                ...state,
                filteredSenadores: state.senadores.filter(senadoresFilter => senadoresFilter.circunscripcion == action.regionID)
            }
        case SELECT_SENADOR:
            return {
                ...state,
                selected: state.senadores.find(senador => senador.id === action.senadorID)
            }
        default:
            return state
    }
}

export default SenadorReducer