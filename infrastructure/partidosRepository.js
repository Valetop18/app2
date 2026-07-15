import { supabase } from "../constants/supabase";
import { getPublicUrl } from "./legisladoresRepository";

const BUCKET_PARTIDOS = "Partidos";

export const partidosRepository = {
  async getPartidos() {
    const { data, error } = await supabase.from("partidos").select("*");

    if (error) throw error;

    return data;
  },

  async savePartidoUsuario(userId, partidoId) {
    const { error } = await supabase.from("usuarios_partidos").insert({
      user_id: userId,
      partido_id: partidoId,
    });

    if (error) throw error;
  },

  async isSaved(userId, partidoId) {
    const { data, error } = await supabase
      .from("usuarios_partidos")
      .select("id")
      .eq("user_id", userId)
      .eq("partido_id", partidoId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async getPartidoById(id) {
    try {
      const { data, error } = await supabase
        .from("partidos")
        .select(
          `
                    id,
                    nombre,
                    sigla,
                    url_img,
                    ranking_estadistico,
                    puntaje_estadistico
                `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        nombre: data.nombre,
        sigla: data.sigla,
        foto: getPublicUrl(data.url_img, BUCKET_PARTIDOS),
        rankingEstadistico: data.ranking_estadistico ?? null,
        puntajeEstadistico: Math.round(Number(data.puntaje_estadistico ?? 0)),
      };
    } catch (error) {
      console.error("Error al obtener el partido: ", error.message);
      return [];
    }
  },

  async getParticipacionHistoricaPartido(partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "participacion_historica_partido",
        {
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error al obtener participacion historica", error.message);
      return [];
    }
  },

  async getParticipacionHistoricaDiputadoPorPartido(partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "participacion_historica_diputado_por_partido",
        {
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      return (data ?? []).reduce((acc, row) => {
        acc[row.id_diputado] = row.porcentaje;
        return acc;
      }, {});
    } catch (error) {
      console.error(
        "Error al obtener participacion historica diputado por partido",
        error.message,
      );
      return [];
    }
  },

  async getMocionesHistoricasDiputadoPorPartido(partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "mociones_historicas_diputado_por_partido",
        {
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      return (data ?? []).reduce((acc, row) => {
        acc[row.id_diputado] = row.total_mociones;
        return acc;
      }, {});
    } catch (error) {
      console.error(
        "Error al obtener mociones historicas diputado por partido",
        error.message,
      );
      return [];
    }
  },

  async getAsistenciaPartidoSesion(partidoId, numeroSesion = null) {
    try {
      const params = { p_partido_id: partidoId, p_numero_sesion: numeroSesion };

      const { data, error } = await supabase.rpc(
        "asistencia_partido_sesion",
        params,
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(
        "Error al obtener asistencia sesion partido",
        error.message,
      );
      return null;
    }
  },

  async getMocionesPorPartido() {
    try {
      const { data, error } = await supabase.rpc("mociones_por_partido");

      if (error) throw error;

      return (data ?? []).reduce((acc, row) => {
        acc[row.partido_id] = row.total_mociones;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error al obtener mociones por partido", error.message);
      return {};
    }
  },

  async getEstadisticasGeneralesPartido(partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "estadisticas_generales_partido",
        {
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      const resultado = data?.[0];

      return {
        asistencia: Number(resultado?.asistencia ?? 0),
        participacionVotaciones: Math.round(
          Number(resultado?.participacion_votaciones ?? 0),
        ),
        mocionesPresentadas: Number(resultado?.mociones_presentadas ?? 0),
        oficiosPresentados: Number(resultado?.oficios_presentados ?? 0),
      };
    } catch (error) {
      console.error(
        "Error al obtener estadísticas generales del partido:",
        error.message,
      );

      return {
        asistencia: 0,
        participacionVotaciones: 0,
        mocionesPresentadas: 0,
        oficiosPresentados: 0,
      };
    }
  },

  async getMocionesAprobadasPartido(partidoId) {
    try {
      const { data, error } = await supabase.rpc("mociones_aprobadas_partido", {
        p_partido_id: partidoId,
      });

      if (error) throw error;

      const resultado = data?.[0];

      return {
        aprobadas: Number(resultado?.aprobadas ?? 0),
        totalMociones: Number(resultado?.total_mociones ?? 0),
        fraccion: resultado?.fraccion ?? "0/0",
      };
    } catch (error) {
      console.error(
        "Error al obtener mociones aprobadas del partido:",
        error.message,
      );

      return {
        aprobadas: 0,
        totalMociones: 0,
        fraccion: "0/0",
      };
    }
  },

  async getDetalleMocionesPartido(partidoId) {
    try {
      const { data, error } = await supabase.rpc("detalle_mociones_partido", {
        p_partido_id: partidoId,
      });

      if (error) throw error;

      return data ?? [];
    } catch (error) {
      console.error(
        "Error al obtener detalle de mociones del partido:",
        error.message,
      );

      return [];
    }
  },

  async getEstadisticasDiputadosPartido(partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "estadisticas_diputados_partido",
        {
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id_legislador,
        idDiputado: row.id_diputado,
        nombre: row.nombre,
        foto: getPublicUrl(row.url_img, "legisladores"),
        distrito: row.distrito,
        partido: row.partido ?? "",
        asistencia: Number(row.asistencia ?? 0),
        participacionVotaciones: Math.round(
          Number(row.participacion_votaciones ?? 0),
        ),
        adherenciaPartido: Number(row.adherencia_partido ?? 0),
        representacionDistrital: Number(row.representacion_distrital ?? 0),

        mocionesAprobadas: Number(row.mociones_aprobadas ?? 0),
        mocionesPresentadas: Number(row.mociones_presentadas ?? 0),
        fraccionMociones: row.fraccion_mociones ?? "0/0",

        totalLikes: Number(row.total_likes ?? 0),

        representacionPromedioPartido: Math.round(
          Number(row.representacion_promedio_partido ?? 0),
        ),
      }));
    } catch (error) {
      console.error(
        "Error al obtener estadísticas de diputados del partido:",
        error.message,
      );

      return [];
    }
  },

  async getCompatibilidadUsuarioPartido(userId, partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "compatibilidad_usuario_partido",
        {
          p_user_id: userId,
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      const resultado = data?.[0];

      return {
        compatibilidad: Math.round(Number(resultado?.compatibilidad ?? 0)),
        coincidencias: Number(resultado?.coincidencias ?? 0),
        totalReacciones: Number(resultado?.total_reacciones ?? 0),
      };
    } catch (error) {
      console.error(
        "Error al obtener compatibilidad con el partido:",
        error.message,
      );

      return {
        compatibilidad: 0,
        coincidencias: 0,
        totalReacciones: 0,
      };
    }
  },

  async getCohesionPartido(partidoId) {
    try {
      const { data, error } = await supabase.rpc("cohesion_partido", {
        p_partido_id: partidoId,
      });

      if (error) throw error;

      const resultado = data?.[0];

      return {
        cohesion: Math.round(Number(resultado?.cohesion ?? 0)),
        votacionesEvaluadas: Number(resultado?.votaciones_evaluadas ?? 0),
      };
    } catch (error) {
      console.error("Error al obtener cohesión del partido:", error.message);

      return {
        cohesion: 0,
        votacionesEvaluadas: 0,
      };
    }
  },
};
