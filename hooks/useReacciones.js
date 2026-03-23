import { useCallback } from "react";
import { reaccionesRepository } from "../infrastructure/ReaccionesRepository";

export function useReacciones(userId, reacciones, setReacciones) {

    const handleLike =  useCallback( async (id, tipoReaccion) => { 

        try {

        const actual = reacciones[id];

        const nueva = actual === tipoReaccion ? "null" : tipoReaccion;

        console.log('intento reaccion')

        const resultado = await reaccionesRepository.setReaccion(
            userId,
            id,
            "representante",
            nueva
        );

        console.log(resultado);

        setReacciones( prev => ({
        ...prev,
        [id]: nueva
        }) );            
        } catch (error) {
        console.log(error)
        }
    }, [userId, reacciones, setReacciones]);

    return { handleLike }


}
