import { ADD_PLACE, LOAD_PLACES } from '../actions/diputado.action'
import Place from '../../models/Place'

const initialState = {
    places: []
}

export default ( state = initialState, action) => {
    switch(action.type) {
        case ADD_PLACE:
            const newPlace = { distrito: action.payload.distrito, region: action.payload.region}
            return {
                ...state,
                places: [newPlace]
            }
        case LOAD_PLACES:
            return {
                ...state,
                places: [newPlace]
            }
        default:
            return state
    }
}

