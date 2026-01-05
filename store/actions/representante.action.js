export const REPRESENTANTES_PARTIDO = 'REPRESENTANTES_PARTIDO'

export const representantePorPartido = (partido) => ({
        type: REPRESENTANTES_PARTIDO,
        partidoID: partido
})