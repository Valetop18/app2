export const SENADORES_PARTIDO = 'SENADORES_PARTIDO'

export const senadoresPorPartido = (partido) => ({
        type: SENADORES_PARTIDO,
        partidoID: partido
})