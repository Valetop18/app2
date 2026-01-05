export const SELECT_PARTIDO_SENADO = 'SELECT_PARTIDO_SENADO'
export const FILTERED_PARTIDO_SENADORES = 'FILTERED_PARTIDO_SENADORES'

export const seleccionPartidoSenado = (partidoEstadistica) => ({
    type: SELECT_PARTIDO_SENADO,
    partidoNM: partidoEstadistica,
})

export const filteredSenadoresPartido = (partidoEstadistica) => ({
    type: FILTERED_PARTIDO_SENADORES,
    partidoNM: partidoEstadistica
})