import { supabase } from "../constants/supabase";

const BUCKET_LEGISLADORES = "legisladores";

export function getPublicUrl(path, bucket) {
  if (!path) return null;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;

  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

function calcularPorcentajeAsistencia(
  asistencias = [],
  ausencias_justificadas = 0,
) {
  if (!asistencias.length) return 0;

  const presentes = asistencias.filter((a) => {
    const asistencia = a.asistencia?.trim().toLowerCase();
    return asistencia === "asiste";
  }).length;

  const presentesFinal = presentes + Number(ausencias_justificadas);

  const porcentaje = Math.round((presentesFinal / asistencias.length) * 100);

  return Math.min(porcentaje, 100);
}

function calcularNumeroOficios(oficios = []) {
  if (!oficios.length) return 0;

  return oficios.length;
}

function calcularPorcentajeAsistenciaPartido(diputados, fecha = null) {
  let total = 0;
  let presentes = 0;

  diputados.forEach((dipu) => {
    let asistencias = dipu.asistencia || [];

    if (fecha) {
      asistencias = asistencias.filter((a) => a.fecha_date === fecha);
    }

    total += asistencias.length;

    asistencias.forEach((a) => {
      const asistencia = a.asistencia?.trim().toLowerCase();
      const observacion = a.observaciones?.trim().toLowerCase() || "";

      const presente = asistencia === "asiste";

      if (presente) {
        presentes++;
      }
    });

    if (!fecha) {
      const ausenciasJustificadas =
        Number(dipu?.asistencia_resumen?.ausencias_justificadas) || 0;
      presentes += ausenciasJustificadas;
    }
  });

  if (total === 0) return 0;

  const porcentaje = Math.round((presentes / total) * 100);

  return Math.min(porcentaje, 100);
}

export const legisladoresRepository = {
  async getLegisladorById(id) {
    try {
      const { data, error } = await supabase
        .from("legisladores")
        .select(
          `
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
                    id,
                    distrito,
                    ranking_estadistico,
                    puntaje_estadistico,
                    asistencia (
                        asistencia,
                        observaciones
                    ),
                    asistencia_resumen (
                        ausencias_justificadas
                    ),
                    diputado_oficios (
                        id_oficio
                    ),
                    diputado_mociones (
                        id_mocion
                    ),
                    diputado_comisiones (
                        comisiones (
                            id_comision,
                            nombre
                        )
                    )
                ),
                senadores(
                    circunscripcion
                )
            `,
        )
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
        edad: calcularEdad(data.fecha_nacimiento),
        partido: data.partidos ? data.partidos.sigla : "",
        rankingEstadistico: data.diputados[0].ranking_estadistico ?? null,
        puntajeEstadistico: data.diputados[0].puntaje_estadistico ?? 0,
        diputado: esDiputado
          ? {
              id: data.diputados[0].id,
              distrito: data.diputados[0].distrito,
            }
          : null,
        senador: esSenador
          ? { circunscripcion: data.senadores[0].circunscripcion }
          : null,
        asistencia: calcularPorcentajeAsistencia(
          data.diputados[0].asistencia,
          data.diputados[0].asistencia_resumen.ausencias_justificadas,
        ),
        oficios: calcularNumeroOficios(data.diputados[0].diputado_oficios),
        mociones: calcularNumeroOficios(data.diputados[0].diputado_mociones),
        comisiones: data.diputados[0].diputado_comisiones.map(
          (dipuComision) => ({
            id: dipuComision.comisiones.id_comision,
            nombre: dipuComision.comisiones.nombre,
          }),
        ),
      };
    } catch (error) {
      console.error("Error al obtener diputados: ", error.message);
      return [];
    }
  },

  async getDiputadosByDistrito(distrito) {
    try {
      const { data, error } = await supabase
        .from("diputados")
        .select(
          `
                id,
                distrito,
                asistencia (
                    asistencia,
                    observaciones
                ),
                asistencia_resumen (
                    ausencias_justificadas
                ),
                diputado_oficios (
                    id_oficio
                    ),
                diputado_mociones (
                    id_mocion
                ),
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
            `,
        )
        .eq("distrito", distrito);

      if (error) throw error;

      const diputadosMapeados = await Promise.all(
        data.map(async (dipu) => {
          const legislador = dipu.legisladores;
          const partido = legislador?.partidos;
          const resumenAsistencia = dipu.asistencia_resumen;

          const porcentajeVotaciones =
            await legisladoresRepository.getParticipacionHistoricaDiputado(
              dipu.id,
            );

          const representacionDistrital =
            await legisladoresRepository.getRepresentacionDistritalDiputado(
              dipu.id,
            );

          const totalLikes =
            await legisladoresRepository.getTotalLikesRepresentante(
              legislador.id,
            );

          return {
            id: legislador.id,
            idDiputado: dipu.id,
            nombre: legislador.nombre,
            distrito: dipu.distrito,
            profesion: legislador.profesion,
            trayectoria: legislador.trayectoria,
            periodoInicio: legislador.periodo_inicio,
            periodoFin: legislador.periodo_fin,
            partido: partido ? partido.sigla : "",
            estado: legislador.estado,
            foto: getPublicUrl(legislador.url_img, BUCKET_LEGISLADORES),
            edad: calcularEdad(legislador.fecha_nacimiento),

            asistencia: calcularPorcentajeAsistencia(
              dipu.asistencia,
              resumenAsistencia?.ausencias_justificadas,
            ),

            votaciones: Math.round(porcentajeVotaciones ?? 0),
            oficios: calcularNumeroOficios(dipu.diputado_oficios),
            mociones: calcularNumeroOficios(dipu.diputado_mociones),

            representacionDistrital: representacionDistrital.representacion,
            representacionCoincidencias: representacionDistrital.coincidencias,
            representacionTotalReacciones:
              representacionDistrital.totalReacciones,
            representacionUsuarios:
              representacionDistrital.usuariosParticipantes,

            totalLikes,
          };
        }),
      );

      return diputadosMapeados;

      return data;
    } catch (error) {
      console.error("Error al obtener diputados: ", error.message);
      return [];
    }
  },

  async getDiputadosByPartido(partidoId, numeroSesion = null, modoData) {
    try {
      const esModoEspefico = modoData === "especifica";

      const numeroSesionObjetivo = esModoEspefico ? numeroSesion : null;

      const { data, error } = await supabase
        .from("diputados")
        .select(
          `
        id,
        distrito,
        asistencia (
          asistencia,
          observaciones,
          fecha_date,
          numero_sesion
        ),
        asistencia_resumen(
          ausencias_justificadas
        ),
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
      `,
        )
        .eq("legisladores.partido_id", partidoId);

      if (error) throw error;

      const hoy = new Date().toISOString().split("T")[0];
      const porcentajeAsistenciaHistorica =
        calcularPorcentajeAsistenciaPartido(data);
      const porcentajeAsistenciaHoy = calcularPorcentajeAsistenciaPartido(
        data,
        hoy,
      );

      return {
        porcentajeAsistenciaHoy,
        porcentajeAsistenciaHistorica,
        modoData,
        diputados: data.map((dipu) => {
          const legislador = dipu.legisladores;
          const partido = legislador?.partidos;
          const resumenAsistencia = dipu.asistencia_resumen;

          const registroSesion = numeroSesionObjetivo
            ? dipu.asistencia.find(
                (a) => a.numero_sesion === numeroSesionObjetivo,
              )
            : null;

          return {
            id: legislador.id,
            nombre: legislador.nombre,
            distrito: dipu.distrito,
            periodoInicio: legislador.periodo_inicio,
            periodoFin: legislador.periodo_fin,
            partido: partido ? partido.sigla : "",
            foto: getPublicUrl(legislador.url_img, BUCKET_LEGISLADORES),
            asistencia: calcularPorcentajeAsistencia(
              dipu.asistencia,
              resumenAsistencia?.ausencias_justificadas,
            ),
            modoData,
            asistenciaSesion: registroSesion?.asistencia === "Asiste",
            observacion: registroSesion
              ? registroSesion.observaciones
              : dipu.asistencia[0]?.observaciones,
          };
        }),
      };
    } catch (error) {
      console.error("Error al obtener diputados: ", error.message);
      return [];
    }
  },

  async getSenadoresByCircunscripcion(circunscripcion) {
    try {
      const { data, error } = await supabase
        .from("senadores")
        .select(
          `
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
            `,
        )
        .eq("circunscripcion", circunscripcion);

      if (error) throw error;

      return data.map((senador) => {
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
          edad: calcularEdad(legislador.fecha_nacimiento),
        };
      });

      return data;
    } catch (error) {
      console.error("Error al obtener senadores: ", error.message);
      return [];
    }
  },

  async getSenadoresByPartido(partidoId) {
    try {
      const { data, error } = await supabase
        .from("senadores")
        .select(
          `
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
            `,
        )
        .eq("legisladores.partido_id", partidoId);

      if (error) throw error;

      return data.map((sena) => {
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
        };
      });

      return data;
    } catch (error) {
      console.error("Error al obtener senadores: ", error.message);
      return [];
    }
  },

  async getPorcentajeAsistenciaPartido(partidoId) {
    try {
      const { data, error } = await supabase
        .from("diputados")
        .select(
          `
                asistencia (
                    asistencia,
                    observaciones,
                    fecha_date
                ),
                asistencia_resumen(
                	ausencias_justificadas
                ),
                legisladores!inner (
                    partido_id
                )    
            `,
        )
        .eq("legisladores.partido_id", partidoId);

      if (error) throw error;

      const hoy = new Date().toISOString().split("T")[0];

      const porcentajeAsistenciaHistorica =
        calcularPorcentajeAsistenciaPartido(data);

      const porcentajeAsistenciaHoy = calcularPorcentajeAsistenciaPartido(
        data,
        hoy,
      );

      return {
        porcentajeAsistenciaHoy,
        porcentajeAsistenciaHistorica,
      };
    } catch (error) {
      console.error("Error al obtener asistencia del partido", error);

      return {
        porcentajeAsistenciaHoy: 0,
        porcentajeAsistenciaHistorica: 0,
      };
    }
  },

  async getParticipacionHistoricaDiputado(idDiputado) {
    try {
      const { data, error } = await supabase.rpc(
        "participacion_historica_diputado",
        {
          p_diputado_id: idDiputado,
        },
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(
        "Error al obtener participacion historica diputado",
        error.message,
      );
      return null;
    }
  },

  async getAtrasosDiputado(idDiputado) {
    try {
      const { data, error } = await supabase.rpc(
        "porcentaje_atrasos_diputado",
        {
          p_diputado_id: idDiputado,
        },
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(
        "Error al obtener el % de atrasos del diputado",
        error.message,
      );
      return null;
    }
  },

  async getAdherenciaDiputadoPartido(idDiputado) {
    try {
      const { data, error } = await supabase.rpc(
        "adherencia_diputado_partido",
        {
          p_id_diputado: idDiputado,
        },
      );

      if (error) throw error;

      return data ?? 0;
    } catch (error) {
      console.error(
        "Error al obtener adherencia diputado partido:",
        error.message,
      );
      return 0;
    }
  },

  async getMocionesAprobadasDiputado(idDiputado) {
    try {
      const { data, error } = await supabase.rpc(
        "mociones_aprobadas_diputado",
        {
          p_id_diputado: idDiputado,
        },
      );

      if (error) throw error;

      const resultado = data?.[0];

      return {
        aprobadas: resultado?.aprobadas ?? 0,
        total: resultado?.total_mociones ?? 0,
        fraccion: resultado?.fraccion ?? "0/0",
      };
    } catch (error) {
      console.error("Error al obtener mociones aprobadas:", error.message);
      return {
        aprobadas: 0,
        total: 0,
        fraccion: "0/0",
      };
    }
  },

  async getCompatibilidadUsuarioDiputado(userId, idDiputado) {
    try {
      const { data, error } = await supabase.rpc(
        "compatibilidad_usuario_diputado",
        {
          p_user_id: userId,
          p_id_diputado: idDiputado,
        },
      );

      if (error) throw error;

      const resultado = data?.[0];

      return {
        compatibilidad: resultado?.compatibilidad ?? 0,
        coincidencias: resultado?.coincidencias ?? 0,
        totalReacciones: resultado?.total_reacciones ?? 0,
      };
    } catch (error) {
      console.error(
        "Error al obtener compatibilidad usuario diputado:",
        error.message,
      );
      return {
        compatibilidad: 0,
        coincidencias: 0,
        totalReacciones: 0,
      };
    }
  },

  async getRepresentacionDistritalDiputado(idDiputado) {
    try {
      const { data, error } = await supabase.rpc(
        "representacion_distrital_diputado",
        {
          p_id_diputado: idDiputado,
        },
      );

      if (error) throw error;

      const resultado = data?.[0];

      return {
        representacion: resultado?.representacion ?? 0,
        coincidencias: resultado?.coincidencias ?? 0,
        totalReacciones: resultado?.total_reacciones ?? 0,
        usuariosParticipantes: resultado?.usuarios_participantes ?? 0,
      };
    } catch (error) {
      console.error(
        "Error al obtener representación distrital:",
        error.message,
      );

      return {
        representacion: 0,
        coincidencias: 0,
        totalReacciones: 0,
        usuariosParticipantes: 0,
      };
    }
  },

  async getTotalLikesRepresentante(idLegislador) {
    try {
      const { data, error } = await supabase.rpc("total_likes_representante", {
        p_id_legislador: idLegislador,
      });

      if (error) throw error;

      return data ?? 0;
    } catch (error) {
      console.error("Error al obtener likes representante:", error.message);
      return 0;
    }
  },

  async getDetalleMocionesDiputado(idDiputado) {
    try {
      const { data, error } = await supabase.rpc("detalle_mociones_diputado", {
        p_id_diputado: idDiputado,
      });

      if (error) throw error;

      return data ?? [];
    } catch (error) {
      console.error(
        "Error al obtener detalle de mociones del diputado:",
        error.message,
      );
      return [];
    }
  },
};
