import * as FileSystem from 'expo-file-system';
import { insertPlaces, fetchPlaces } from '../../db';

export const ADD_PLACE = 'ADD_PLACE'
export const LOAD_PLACES = 'LOAD_PLACES'

export const addPlace = (distrito, region) => {
    return async dispatch => {

        try {

            const result = await insertPlaces(
                distrito,
                region
            )
            
            dispatch({ type: ADD_PLACE, payload: { 
                distrito,
                region, 
            }})
        } catch (error) {
            console.log(error.message)
            throw error
        }
    }
}

export const loadPlaces = () => {
    return async dispatch => {
        try {
            const result = await fetchPlaces()
            console.log(result)
            dispatch({ type: LOAD_PLACES, places: result.rows._array})
        } catch (error) {
            console.log(error.message)
            throw error
        }
    }
}