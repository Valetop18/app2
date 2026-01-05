export const SELECT_PARTIDO = 'SELECT_PARTIDO'
export const FILTERED_PARTIDO_DIPUTADOS = 'FILTERED_PARTIDO_DIPUTADOS'

export const seleccionPartido = (partidoEstadistica) => ({
    type: SELECT_PARTIDO,
    partidoNM: partidoEstadistica,
})

export const filteredDiputadosPartido = (partidoEstadistica) => ({
    type: FILTERED_PARTIDO_DIPUTADOS,
    partidoNM: partidoEstadistica
})