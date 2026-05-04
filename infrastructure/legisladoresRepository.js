import { supabase } from "../constants/supabase";

const BUCKET_LEGISLADORES = "legisladores";

export function getPublicUrl(path, bucket){
    if (!path) return null;

    const { data } =  supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;

}

function calcularEdad( fechaNacimiento ){
    if(!fechaNacimiento) return null;

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if ( mes < 0 || ( mes === 0 && hoy.getDate() < nacimiento.getDate()   )  ) {
        edad--;
    }
    return edad;

}

export const legisladoresRepository = {

    async getLegisladorById(id) {
        try {
            const { data, error } = await supabase
            .from('legisladores')
            .select(`
                id,
                nombre,
                url_img,
                fecha_nacimiento,
                profesion,
                trayectoria,
                periodo_inicio,
                periodo_fin,
                partido_id,
                estado,
                partidos (
                    id,
                    nombre,
                    sigla
                ),
                diputados(
                    distrito
                ),
                senadores(
                    circunscripcion
                )
            `)
            .eq("id", id)
            .single();

            if (error) throw error;

            const esDiputado = data.diputados && data.diputados.length > 0;
            const esSenador = data.senadores && data.senadores.length > 0;

            return {
                    id: data.id,
                    nombre: data.nombre,
                    profesion: data.profesion,
                    trayectoria: data.trayectoria,
                    periodoInicio: data.periodo_inicio,
                    periodoFin: data.periodo_fin,
                    estado: data.estado,
                    foto: getPublicUrl(data.url_img, BUCKET_LEGISLADORES),
                    edad: calcularEdad(data.fecha_nacimiento) ,
                    partido: data.partidos ? data.partidos.sigla : "",
                    diputado : esDiputado ? {distrito: data.diputados[0].distrito } : null,
                    senador : esSenador ? {circunscripcion: data.senadores[0].circunscripcion } : null
                }
            }

         catch (error) {
            console.error("Error al obtener diputados: ", error.message);
            return [];
        }
    },
    
    async getDiputadosByDistrito(distrito) {
        try {

            const { data, error } = await supabase
            .from('diputados')
            .select(`
                id,
                distrito,
                legisladores (
                    id,
                    nombre,
                    url_img,
                    fecha_nacimiento,
                    profesion,
                    trayectoria,
                    periodo_inicio,
                    periodo_fin,
                    estado,
                    partidos (
                        id,
                        nombre,
                        sigla
                    )
                )    
            `)
            .eq("distrito", distrito);


            if (error) throw error;

            return data.map( dipu => {
                const legislador = dipu.legisladores;
                const partido = legislador?.partidos;

                return {
                    id: legislador.id,
                    nombre: legislador.nombre,
                    distrito: dipu.distrito,
                    profesion: legislador.profesion,
                    trayectoria: legislador.trayectoria,
                    periodoInicio: legislador.periodo_inicio,
                    periodoFin: legislador.periodo_fin,
                    partido: partido ? partido.sigla : "",
                    estado: legislador.estado,
                    foto: getPublicUrl(legislador.url_img, BUCKET_LEGISLADORES),
                    edad: calcularEdad(legislador.fecha_nacimiento)     
                }
            })
            
            return data;

        } catch (error) {
            console.error("Error al obtener diputados: ", error.message);
            return [];
        }
    },

    async getDiputadosByPartido(partidoId){
        try {
            const { data, error } = await supabase
            .from('diputados')
            .select(`
                id,
                distrito,
                legisladores!inner (
                    id,
                    nombre,
                    url_img,
                    periodo_inicio,
                    periodo_fin,
                    partido_id,
                    partidos (
                        id,
                        nombre,
                        sigla
                    )
                )    
            `)
            .eq("legisladores.partido_id", partidoId);

            if (error) throw error;

            return data.map( dipu => {
                console.log('diputados filtrados: ', dipu )
                const legislador = dipu.legisladores;
                const partido = legislador?.partidos;

                return {
                    id: legislador.id,
                    nombre: legislador.nombre,
                    distrito: dipu.distrito,
                    periodoInicio: legislador.periodo_inicio,
                    periodoFin: legislador.periodo_fin,
                    partido: partido ? partido.sigla : "",
                    foto: getPublicUrl(legislador.url_img, BUCKET_LEGISLADORES),
                }
            })
            
            return data;

        } catch (error) {
            console.error("Error al obtener diputados: ", error.message);
            return [];
        }
    },

    async getSenadoresByCircunscripcion(circunscripcion) {
        try {

            const { data, error } = await supabase
            .from('senadores')
            .select(`
                id,
                circunscripcion,
                legisladores (
                    id,
                    nombre,
                    url_img,
                    fecha_nacimiento,
                    profesion,
                    trayectoria,
                    periodo_inicio,
                    periodo_fin,
                    partidos (
                        id,
                        nombre,
                        sigla
                    )
                )    
            `)
            .eq("circunscripcion", circunscripcion);


            if (error) throw error;

            return data.map( senador => {
                const legislador = senador.legisladores;
                const partido = legislador?.partidos;

                return {
                    id: legislador.id,
                    nombre: legislador.nombre,
                    circunscripcion: senador.circunscripcion,
                    profesion: legislador.profesion,
                    trayectoria: legislador.trayectoria,
                    periodoInicio: legislador.periodo_inicio,
                    periodoFin: legislador.periodo_fin,
                    partido: partido ? partido.sigla : "",
                    foto: getPublicUrl(legislador.url_img, BUCKET_LEGISLADORES),
                    edad: calcularEdad(legislador.fecha_nacimiento)     
                }
            })
            
            return data;

        } catch (error) {
            console.error("Error al obtener senadores: ", error.message);
            return [];
        }
    },

    async getSenadoresByPartido(partidoId){
        try {
            const { data, error } = await supabase
            .from('senadores')
            .select(`
                id,
                circunscripcion,
                legisladores!inner (
                    id,
                    nombre,
                    url_img,
                    periodo_inicio,
                    periodo_fin,
                    partido_id,
                    partidos (
                        id,
                        nombre,
                        sigla
                    )
                )    
            `)
            .eq("legisladores.partido_id", partidoId);

            if (error) throw error;

            return data.map( sena => {
                console.log('senadores filtrados: ', sena )
                const legislador = sena.legisladores;
                const partido = legislador?.partidos;

                return {
                    id: legislador.id,
                    nombre: legislador.nombre,
                    circunscripcion: sena.circunscripcion,
                    periodoInicio: legislador.periodo_inicio,
                    periodoFin: legislador.periodo_fin,
                    partido: partido ? partido.sigla : "",
                    foto: getPublicUrl(legislador.url_img, BUCKET_LEGISLADORES),
                }
            })
            
            return data;

        } catch (error) {
            console.error("Error al obtener senadores: ", error.message);
            return [];
        }
    },


}
