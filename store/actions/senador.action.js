export const SELECT_SENADOR = 'SELECT_SENADOR'
export const FILTERED_SENADORES = 'FILTERED_SENADORES'

export const selectSenador = (id) => ({
    type: SELECT_SENADOR,
    senadorID: id,
})

export const filteredSenadores = (region) => ({
    type: FILTERED_SENADORES,
    regionID: region
})