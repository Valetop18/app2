export const SELECT_DIPUTADO = 'SELECT_DIPUTADO'
export const FILTERED_DIPUTADOS = 'FILTERED_DIPUTADOS'
export const CHANGE_DISTRITO = 'CHANGE_DISTRITO'

export const selectDiputado = (id) => ({
    type: SELECT_DIPUTADO,
    diputadoID: id,
})

export const filteredDiputados = (distrito) => ({
    type: FILTERED_DIPUTADOS,
    distritoID: distrito
})

export const changeDistrit = () => {
    return({
        type: CHANGE_DISTRITO,
    })
}