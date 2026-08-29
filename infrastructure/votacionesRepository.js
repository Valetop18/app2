import { supabase } from "../constants/supabase";
import { getPublicUrl } from "./legisladoresRepository";

const LIMITE_DEFAULT = 60;
const BUCKET_LEGISLADORES = "legisladores";

export const votacionesRepository = {
  async getUltimasVotaciones(limite = LIMITE_DEFAULT, legisladorId) {
    try {
      const { data: votaciones, error } = await supabase
        .from("votaciones")
        .select(
          `
                id_votacion,
                tipo_documento,
                materia,
                articulo,
                resultado,
                articulo_resumen,
                materia_resumen
            `,
        )
        .order("id_votacion", { ascending: false })
        .limit(limite);

      if (error) throw error;

      const idsVotaciones = votaciones.map((v) => v.id_votacion); //[3435, 7384, 8475, 9485]

      //idDiputado = 915
      const { data: votos, error: errorVotos } = await supabase
        .from("votos_diputado")
        .select("id_votacion, voto")
        .eq("id_diputado", legisladorId)
        .in("id_votacion", idsVotaciones);

      if (errorVotos) throw errorVotos;

      const { data: reaccionesVotaciones, error: errorReacciones } =
        await supabase
          .from("user_reacciones")
          .select("target_id, tipo_reaccion")
          .eq("target_type", "ley")
          .in("target_id", idsVotaciones);

      if (errorReacciones) throw errorReacciones;

      const totalesReacciones = (reaccionesVotaciones ?? []).reduce(
        (acc, reaccion) => {
          const id = Number(reaccion.target_id);

          if (!acc[id]) {
            acc[id] = {
              likes: 0,
              dislikes: 0,
            };
          }

          if (reaccion.tipo_reaccion === "like") {
            acc[id].likes += 1;
          }

          if (reaccion.tipo_reaccion === "dislike") {
            acc[id].dislikes += 1;
          }

          return acc;
        },
        {},
      );

      //ajustar retorno para vista

      const votosPorVotacion = votos.reduce((acc, v) => {
        acc[v.id_votacion] = v.voto;
        return acc;
      }, {});

      return votaciones.map((v) => ({
        id: v.id_votacion,
        tipoDocumento: v.tipo_documento || "",
        materia: v.materia || "",
        articulo: v.articulo || "",
        materia_resumen: v.materia_resumen || "",
        articulo_resumen: v.articulo_resumen || "",
        resultado: v.resultado || "",
        votoRepresentante: votosPorVotacion[v.id_votacion] || null,
        totalLikes: totalesReacciones[v.id_votacion]?.likes ?? 0,
        totalDislikes: totalesReacciones[v.id_votacion]?.dislikes ?? 0,
      }));
    } catch (error) {
      console.error("Error al obtener votaciones: ", error.message);
      return [];
    }
  },

  async getUltimasVotacionesSenador(
    limite = LIMITE_DEFAULT,
    legisladorId,
  ) {
    try {
      const { data: votaciones, error } = await supabase
        .from("votaciones_senado")
        .select(
          `
          id_votacion,
          numero_sesion,
          fecha_texto,
          tema,
          boletin,
          resultado
        `,
        )
        .order("id_votacion", { ascending: false })
        .limit(limite);

      if (error) throw error;

      const idsVotaciones = votaciones.map((v) => v.id_votacion);

      const { data: votos, error: errorVotos } = await supabase
        .from("votos_senador")
        .select("id_votacion, voto")
        .eq("id_senador", legisladorId)
        .in("id_votacion", idsVotaciones);

      if (errorVotos) throw errorVotos;

      const { data: reaccionesVotaciones, error: errorReacciones } =
        await supabase
          .from("user_reacciones")
          .select("target_id, tipo_reaccion")
          .eq("target_type", "ley")
          .in("target_id", idsVotaciones);

      if (errorReacciones) throw errorReacciones;

      const totalesReacciones = (reaccionesVotaciones ?? []).reduce(
        (acc, reaccion) => {
          const id = Number(reaccion.target_id);

          if (!acc[id]) {
            acc[id] = {
              likes: 0,
              dislikes: 0,
            };
          }

          if (reaccion.tipo_reaccion === "like") {
            acc[id].likes += 1;
          }

          if (reaccion.tipo_reaccion === "dislike") {
            acc[id].dislikes += 1;
          }

          return acc;
        },
        {},
      );

      const votosPorVotacion = votos.reduce((acc, v) => {
        acc[v.id_votacion] = v.voto;
        return acc;
      }, {});

      return votaciones.map((v) => ({
        id: v.id_votacion,
        numeroSesion: v.numero_sesion,
        fechaTexto: v.fecha_texto,
        tema: v.tema || "",
        boletin: v.boletin || "",

        resultado: v.resultado || "",

        votoRepresentante:
          votosPorVotacion[v.id_votacion] || null,

        totalLikes:
          totalesReacciones[v.id_votacion]?.likes ?? 0,

        totalDislikes:
          totalesReacciones[v.id_votacion]?.dislikes ?? 0,
      }));
    } catch (error) {
      console.error(
        "Error al obtener votaciones del Senado: ",
        error.message,
      );
      return [];
    }
  },

  filtrarVotaciones(votaciones, texto) {
    if (!texto || texto.trim() === "") return votaciones;

    const textUpper = texto.toUpperCase();

    return votaciones.filter((v) => {
      const tipo = v.tipoDocumento.toUpperCase();
      const materia = v.materia.toUpperCase();
      const articulo = v.articulo.toUpperCase();

      return (
        tipo.includes(textUpper) ||
        materia.includes(textUpper) ||
        articulo.includes(textUpper)
      );
    });
  },

  async buscarVotaciones(texto, limite = 15) {
    try {
      if (!texto || texto.trim().length < 2) return [];

      const { data, error } = await supabase.rpc("buscar_votaciones", {
        p_busqueda: texto.trim(),
        p_limite: limite,
      });

      if (error) throw error;

      return data.map((v) => ({
        id: v.id_votacion,
        idVotacion: v.id_votacion,
        numeroSesion: v.numero_sesion,
        fechaDate: v.fecha_date,
        fechaTexto: v.fecha_texto,
        sesion: v.sesion,

        tipoDocumento: v.tipo_documento || "",
        materia: v.materia || "",
        articulo: v.articulo || "",
        materia_resumen: v.materia_resumen || "",
        articulo_resumen: v.articulo_resumen || "",
        resultado: v.resultado || "",

        totalLikes: Number(v.total_likes ?? 0),
        totalDislikes: Number(v.total_dislikes ?? 0),
      }));
    } catch (error) {
      console.error("Error al buscar votaciones: ", error.message);
      return [];
    }
  },

  async buscarVotacionesSenado(texto, limite = 15) {
    try {
      if (!texto || texto.trim().length < 2) return [];

      const { data, error } = await supabase.rpc(
        "buscar_votaciones_senado",
        {
          p_busqueda: texto.trim(),
          p_limite: limite,
        },
      );

      if (error) throw error;

      return data.map((v) => ({
        id: v.id_votacion,
        idVotacion: v.id_votacion,
        numeroSesion: v.numero_sesion,
        fechaTexto: v.fecha_texto,
        tema: v.tema || "",
        boletin: v.boletin || "",

        // Lo dejamos preparado
        resultado: v.resultado || "",
      }));
    } catch (error) {
      console.error(
        "Error al buscar votaciones del Senado:",
        error.message,
      );
      return [];
    }
  },

  async getAsistenciaSesionGlobal(numeroSesion = null) {
    try {
      const { data, error } = await supabase.rpc("asistencia_sesion_global", {
        p_numero_sesion: numeroSesion,
      });

      if (error) throw error;

      const resultado = data?.[0];
      return {
        porcentaje: resultado?.porcentaje ?? 0,
        numeroSesion: resultado?.sesion ?? null,
      };
    } catch (error) {
      console.error("Error al obtener asistencia sesion global", error.message);
      return null;
    }
  },

  async getAsistenciaSesionGlobalSenadores(numeroSesion = null) {
    try {
      const { data, error } = await supabase.rpc(
        "asistencia_sesion_global_senadores",
        {
          p_numero_sesion: numeroSesion,
        },
      );

      if (error) throw error;

      const resultado = data?.[0];

      return {
        porcentaje: resultado?.porcentaje ?? 0,
        numeroSesion: resultado?.sesion ?? null,
      };
    } catch (error) {
      console.error(
        "Error al obtener asistencia sesion global senadores",
        error.message,
      );
      return null;
    }
  },

  async getAsistenciaGlobal() {
    try {
      const { data, error } = await supabase.rpc("asistencia_global");

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error al obtener asistencia global", error.message);
      return null;
    }
  },

  async getAsistenciaGlobalSenadores() {
    try {
      const { data, error } = await supabase.rpc(
        "asistencia_global_senadores",
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(
        "Error al obtener asistencia global senadores",
        error.message,
      );
      return null;
    }
  },

  async getVotacionesPorSesion(numeroSesion) {
    try {
      const { data, error } = await supabase
        .from("votaciones")
        .select(
          `
                id_votacion,
                tipo_documento,
                materia,
                articulo,
                resultado,
                sesion,
                articulo_resumen,
                materia_resumen,
                fecha_texto
            `,
        )
        .ilike("sesion", `%n°${numeroSesion},%`)
        .order("id_votacion", { ascending: false });

      if (error) throw error;

      return data.map((v) => ({
        id: v.id_votacion,
        tipoDocumento: v.tipo_documento || "",
        materia: v.materia || "",
        articulo: v.articulo || "",
        materia_resumen: v.materia_resumen || "",
        articulo_resumen: v.articulo_resumen || "",
        resultado: v.resultado || "",
        sesion: v.sesion || "",
        fecha: v.fecha_texto || "",
      }));
    } catch (error) {
      console.error("Error al obtener votaciones por sesion: ", error.message);
      return [];
    }
  },

  async getVotacionesPorSesionSenadores(numeroSesion) {
    try {
      const { data, error } = await supabase
        .from("votaciones_senado")
        .select(
          `
          id_votacion,
          numero_sesion,
          fecha_texto,
          tema,
          boletin,
          resultado,
          quorum
        `,
        )
        .eq("numero_sesion", numeroSesion)
        .order("id_votacion", { ascending: false });

      if (error) throw error;

      return data.map((v) => ({
        id: v.id_votacion,
        fecha: v.fecha_texto || "",
        tema: v.tema || "",
        boletin: v.boletin || "",
        resultado: v.resultado || "",
        quorum: v.quorum || "",
        sesion: v.numero_sesion ?? "",
      }));
    } catch (error) {
      console.error(
        "Error al obtener votaciones Senado por sesion: ",
        error.message,
      );
      return [];
    }
  },

  async getVotacionesPorSesion2(numeroSesion) {
    try {
      const { data, error } = await supabase.rpc(
        "participacion_partidos_por_sesion",
        {
          p_numero_sesion: numeroSesion,
        },
      );

      if (error) throw error;

      const agrupado = (data ?? []).reduce((acc, row) => {
        if (!acc[row.id_votacion]) {
          acc[row.id_votacion] = {
            id: row.id_votacion,
            tipoDocumento: row.tipo_documento,
            fecha: row.fecha_texto,
            resultado: row.resultado,
            materia_resumen: row.materia_resumen,
            articulo_resumen: row.articulo_resumen,
            partidos: {},
          };
        }

        acc[row.id_votacion].partidos[row.partido_id] = {
          favor: row.pct_favor,
          contra: row.pct_contra,
          abstencion: row.pct_abstencion,
        };
        return acc;
      }, {});

      return Object.values(agrupado).sort((a, b) => b.id - a.id);
    } catch (error) {
      console.error("Error al obtener asistencia global", error.message);
      return [];
    }
  },

  async getVotacionesPorSesion2Senadores(numeroSesion) {
    try {
      const { data, error } = await supabase.rpc(
        "participacion_partidos_por_sesion_senadores",
        {
          p_numero_sesion: numeroSesion,
        },
      );

      if (error) throw error;

      const agrupado = (data ?? []).reduce((acc, row) => {
        if (!acc[row.id_votacion]) {
          acc[row.id_votacion] = {
            id: row.id_votacion,
            fecha: row.fecha_texto,
            tema: row.tema,
            boletin: row.boletin,
            resultado: row.resultado,
            quorum: row.quorum,
            partidos: {},
          };
        }

        acc[row.id_votacion].partidos[row.partido_id] = {
          favor: row.pct_favor,
          contra: row.pct_contra,
          abstencion: row.pct_abstencion,
        };

        return acc;
      }, {});

      return Object.values(agrupado).sort((a, b) => b.id - a.id);
    } catch (error) {
      console.error(
        "Error al obtener participación partidos Senado por sesión",
        error.message,
      );
      return [];
    }
  },

  async getVotacionPorId2(idVotacion) {
    try {
      const { data, error } = await supabase.rpc(
        "participacion_partidos_por_votacion",
        {
          p_id_votacion: idVotacion,
        },
      );

      if (error) throw error;

      const agrupado = (data ?? []).reduce((acc, row) => {
        if (!acc[row.id_votacion]) {
          acc[row.id_votacion] = {
            id: row.id_votacion,
            tipoDocumento: row.tipo_documento,
            fecha: row.fecha_texto,
            resultado: row.resultado,
            materia: row.materia,
            articulo: row.articulo,
            materia_resumen: row.materia_resumen,
            articulo_resumen: row.articulo_resumen,
            partidos: {},
          };
        }

        acc[row.id_votacion].partidos[row.partido_id] = {
          favor: row.pct_favor,
          contra: row.pct_contra,
          abstencion: row.pct_abstencion,
          pareo: row.pct_pareo,
        };

        return acc;
      }, {});

      return Object.values(agrupado);
    } catch (error) {
      console.error("Error al obtener votación por id", error.message);
      return [];
    }
  },

  async getVotacionPorId2Senadores(idVotacion) {
    try {
      const { data, error } = await supabase.rpc(
        "participacion_partidos_por_votacion_senadores",
        {
          p_id_votacion: idVotacion,
        },
      );

      if (error) throw error;

      const agrupado = (data ?? []).reduce((acc, row) => {
        if (!acc[row.id_votacion]) {
          acc[row.id_votacion] = {
            id: row.id_votacion,
            fecha: row.fecha_texto,
            tema: row.tema || "",
            boletin: row.boletin || "",
            resultado: row.resultado || "",
            quorum: row.quorum || "",
            partidos: {},
          };
        }

        acc[row.id_votacion].partidos[row.partido_id] = {
          favor: row.pct_favor,
          contra: row.pct_contra,
          abstencion: row.pct_abstencion,
          pareo: row.pct_pareo,
        };

        return acc;
      }, {});

      return Object.values(agrupado);
    } catch (error) {
      console.error(
        "Error al obtener votación Senado por id",
        error.message,
      );
      return [];
    }
  },

  async getVotosDiputadoPorVotaciones(idDiputado, idsVotaciones = []) {
    try {
      if (!idDiputado || idsVotaciones.length === 0) return [];

      const { data, error } = await supabase
        .from("votos_diputado")
        .select("id_votacion, voto")
        .eq("id_diputado", idDiputado)
        .in("id_votacion", idsVotaciones);

      if (error) throw error;

      return data ?? [];
    } catch (error) {
      console.error("Error al obtener votos del diputado:", error.message);
      return [];
    }
  },

  async getVotosSenadorPorVotaciones(idSenador, idsVotaciones = []) {
    try {
      if (!idSenador || idsVotaciones.length === 0) return [];

      const { data, error } = await supabase
        .from("votos_senador")
        .select("id_votacion, voto")
        .eq("id_senador", idSenador)
        .in("id_votacion", idsVotaciones);

      if (error) throw error;

      return data ?? [];
    } catch (error) {
      console.error("Error al obtener votos del senador:", error.message);
      return [];
    }
  },

  async getVotosPartidoPorSesion(numeroSesion, partidoId) {
    try {
      const { data, error } = await supabase.rpc("votos_partido_por_sesion", {
        p_numero_sesion: numeroSesion,
        p_partido_id: partidoId,
      });

      if (error) throw error;

      const agrupado = (data ?? []).reduce((acc, row) => {
        if (!acc[row.id_votacion]) {
          acc[row.id_votacion] = {
            id: row.id_votacion,
            diputados: [],
          };
        }

        acc[row.id_votacion].diputados.push({
          id: row.id_diputado,
          nombre: row.nombre,
          foto: getPublicUrl(row.url_img, BUCKET_LEGISLADORES),
          voto: row.voto,
        });

        return acc;
      }, {});

      return Object.values(agrupado).sort((a, b) => b.id - a.id);
    } catch (error) {
      console.error(
        "Error al obtener votos por partido y sesion",
        error.message,
      );
      return [];
    }
  },

  async getVotosPartidoPorSesionSenadores(numeroSesion, partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "votos_partido_por_sesion_senadores",
        {
          p_numero_sesion: numeroSesion,
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      const agrupado = (data ?? []).reduce((acc, row) => {
        if (!acc[row.id_votacion]) {
          acc[row.id_votacion] = {
            id: row.id_votacion,
            senadores: [],
          };
        }

        acc[row.id_votacion].senadores.push({
          id: row.id_senador,
          nombre: row.nombre,
          foto: getPublicUrl(row.url_img, BUCKET_LEGISLADORES),
          voto: row.voto,
        });

        return acc;
      }, {});

      return Object.values(agrupado).sort((a, b) => b.id - a.id);
    } catch (error) {
      console.error(
        "Error al obtener votos por partido y sesion senadores",
        error.message,
      );
      return [];
    }
  },

  async getVotosPartidoPorVotacion(idVotacion, partidoId) {
    try {
      const { data, error } = await supabase.rpc("votos_partido_por_votacion", {
        p_id_votacion: idVotacion,
        p_partido_id: partidoId,
      });

      if (error) throw error;

      const agrupado = (data ?? []).reduce((acc, row) => {
        if (!acc[row.id_votacion]) {
          acc[row.id_votacion] = {
            id: row.id_votacion,
            diputados: [],
          };
        }

        acc[row.id_votacion].diputados.push({
          id: row.id_diputado,
          nombre: row.nombre,
          foto: getPublicUrl(row.url_img, BUCKET_LEGISLADORES),
          voto: row.voto,
        });

        return acc;
      }, {});

      return Object.values(agrupado);
    } catch (error) {
      console.error(
        "Error al obtener votos por partido y votación",
        error.message,
      );
      return [];
    }
  },

  async getVotosPartidoPorVotacionSenadores(idVotacion, partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "votos_partido_por_votacion_senadores",
        {
          p_id_votacion: idVotacion,
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      const agrupado = (data ?? []).reduce((acc, row) => {
        if (!acc[row.id_votacion]) {
          acc[row.id_votacion] = {
            id: row.id_votacion,
            senadores: [],
          };
        }

        acc[row.id_votacion].senadores.push({
          id: row.id_senador,
          nombre: row.nombre,
          foto: getPublicUrl(row.url_img, BUCKET_LEGISLADORES),
          voto: row.voto,
        });

        return acc;
      }, {});

      return Object.values(agrupado);
    } catch (error) {
      console.error(
        "Error al obtener votos Senado por partido y votación",
        error.message,
      );
      return [];
    }
  },

  //votacion_partido_por_sesion

  async getVotacionPartidoPorSesion(numeroSesion, partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "votacion_partido_por_sesion",
        {
          p_numero_sesion: numeroSesion,
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      return data ?? 0;
    } catch (error) {
      console.error(
        "Error al obtener votacion partido por sesion",
        error.message,
      );
      return 0;
    }
  },

  async getVotacionPartidoPorSesionSenadores(numeroSesion, partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "votacion_partido_por_sesion_senadores",
        {
          p_numero_sesion: numeroSesion,
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      return data ?? 0;
    } catch (error) {
      console.error(
        "Error al obtener votacion partido por sesion Senado",
        error.message,
      );
      return 0;
    }
  },

  async getVotacionDiputadosPorSesion(numeroSesion, partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "votacion_diputados_por_sesion",
        {
          p_numero_sesion: numeroSesion,
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id_diputado,
        nombre: row.nombre,
        foto: getPublicUrl(row.url_img, BUCKET_LEGISLADORES),
        porcentaje: row.porcentaje,
      }));
    } catch (error) {
      console.error(
        "Error al obtener votacion diputados por sesion",
        error.message,
      );
      return [];
    }
  },

  async getVotacionSenadoresPorSesion(numeroSesion, partidoId) {
    try {
      const { data, error } = await supabase.rpc(
        "votacion_senadores_por_sesion",
        {
          p_numero_sesion: numeroSesion,
          p_partido_id: partidoId,
        },
      );

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id_senador,
        nombre: row.nombre,
        foto: getPublicUrl(row.url_img, BUCKET_LEGISLADORES),
        porcentaje: row.porcentaje,
      }));
    } catch (error) {
      console.error(
        "Error al obtener votacion senadores por sesion",
        error.message,
      );
      return [];
    }
  },

  async getVotacionSesionGlobal(sesion = null) {
    try {
      const params = sesion;

      const { data, error } = await supabase.rpc(
        "participacion_sesion_global",
        {
          p_numero_sesion: sesion,
        },
      );

      if (error) throw error;

      return {
        porcentaje: data ?? 0,
      };
    } catch (error) {
      console.error("Error al obtener votacion sesion global", error.message);
      return null;
    }
  },

  async getVotacionSesionGlobalSenadores(sesion = null) {
    try {
      const { data, error } = await supabase.rpc(
        "participacion_sesion_global_senadores",
        {
          p_numero_sesion: sesion,
        },
      );

      if (error) throw error;

      const resultado = data?.[0];

      return {
        porcentaje: resultado?.porcentaje ?? 0,
        numeroSesion: resultado?.sesion ?? null,
      };
    } catch (error) {
      console.error(
        "Error al obtener votacion sesion global Senado",
        error.message,
      );
      return null;
    }
  },

  async getVotacionHistoricaGlobal() {
    try {
      const { data, error } = await supabase.rpc(
        "participacion_historica_global",
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error al obtener votacion global", error.message);
      return null;
    }
  },

  async getVotacionHistoricaGlobalSenadores() {
    try {
      const { data, error } = await supabase.rpc(
        "participacion_historica_global_senadores",
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(
        "Error al obtener votacion global senadores",
        error.message,
      );
      return null;
    }
  },

  async getMocionesHistoricasGlobal() {
    try {
      const { data, error } = await supabase.rpc("mociones_historicas_global");

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error al obtener mociones global", error.message);
      return null;
    }
  },

  async getMocionesHistoricasGlobalSenadores() {
    try {
      const { data, error } = await supabase.rpc(
        "mociones_historicas_global_senadores"
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(
        "Error al obtener mociones global senadores",
        error.message
      );
      return null;
    }
  },

  async getFechaSesionCalendario() {
    try {
      const { data, error } = await supabase.rpc("obtener_sesiones_calendario");

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error al obtener sesiones para calendario", error.message);
      return null;
    }
  },

  async getFechaSesionCalendarioSenadores() {
    try {
      const { data, error } = await supabase.rpc(
        "obtener_sesiones_calendario_senadores",
      );

      if (error) throw error;

      return data ?? [];
    } catch (error) {
      console.error(
        "Error al obtener sesiones Senado para calendario",
        error.message,
      );
      return [];
    }
  },
};
