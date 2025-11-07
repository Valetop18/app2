import { SELECT_DIPUTADO} from '../actions/diputado.action'
import { FILTERED_DIPUTADOS, CHANGE_DISTRITO } from '../actions/diputado.action'

import { DIPUTADOS } from "../../data/diputados"

const initialState = {
    selected: null,
    diputados: DIPUTADOS,
    filteredDiputados: [],
    distrito: null
}

const DiputadoReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILTERED_DIPUTADOS:
            return {
                ...state,
                filteredDiputados: state.diputados.filter(diputadosFilter => diputadosFilter.distrito === action.distritoID),
                distrito: action.distritoID
            }
        case SELECT_DIPUTADO:
            return {
                ...state,
                selected: state.diputados.find(diputado => diputado.id === action.diputadoID)
            }
        case CHANGE_DISTRITO:
            return {
                ...state,
                filteredDiputados:[],
            }
        default:
            return state
    }
}

export default DiputadoReducer
