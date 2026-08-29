import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { legisladoresRepository } from "../infrastructure/legisladoresRepository";

const DataContext = createContext(null);

const estadoInicialDiputados = {
  datos: [],
  distrito: null,
  fechaCarga: null,
};

const estadoInicialSenadores = {
  datos: [],
  circunscripcion: null,
  fechaCarga: null,
};

export const DataProvider = ({ children }) => {
  const [cacheDiputados, setCacheDiputados] = useState(estadoInicialDiputados);
  const [cacheSenadores, setCacheSenadores] = useState(estadoInicialSenadores);

  const [cacheDetalleDiputados, setCacheDetalleDiputados] = useState({});
  const [cacheDetalleSenadores, setCacheDetalleSenadores] = useState({});

  const [totalesLikesRepresentantes, setTotalesLikesRepresentantes] =
    useState({});

  const cargasDetalleDiputadosEnCurso = useRef({});
  const cargasDetalleSenadoresEnCurso = useRef({});

  const [loadingDiputados, setLoadingDiputados] = useState(false);
  const [loadingSenadores, setLoadingSenadores] = useState(false);

  const cargaDiputadosEnCurso = useRef(null);
  const cargaSenadoresEnCurso = useRef(null);

  const cargarDiputados = useCallback(
    async (distrito, opciones = {}) => {
      const { forceRefresh = false } = opciones;

      if (!distrito) {
        return [];
      }

      const mismoDistrito =
        Number(cacheDiputados.distrito) === Number(distrito);

      const existenDatos = cacheDiputados.datos.length > 0;

      if (!forceRefresh && mismoDistrito && existenDatos) {
        return cacheDiputados.datos;
      }

      /*
       * Si ya existe una consulta en curso para este distrito,
       * reutilizamos la misma promesa.
       */
      if (cargaDiputadosEnCurso.current?.distrito === Number(distrito)) {
        return cargaDiputadosEnCurso.current.promesa;
      }

      const promesaCarga = (async () => {
        try {
          setLoadingDiputados(true);

          const data =
            await legisladoresRepository.getDiputadosByDistrito(distrito);

          /*
           * Creamos una copia antes de ordenar para no modificar
           * directamente el array entregado por el repositorio.
           *
           * Este orden queda guardado en memoria y no cambia cada vez
           * que se vuelve a abrir la pantalla.
           */
          const diputadosOrdenados = [...data].sort(() => Math.random() - 0.5);

          setCacheDiputados({
            datos: diputadosOrdenados,
            distrito: Number(distrito),
            fechaCarga: Date.now(),
          });

          return diputadosOrdenados;
        } catch (error) {
          console.error("Error al cargar diputados desde DataContext:", error);

          return [];
        } finally {
          setLoadingDiputados(false);
          cargaDiputadosEnCurso.current = null;
        }
      })();

      cargaDiputadosEnCurso.current = {
        distrito: Number(distrito),
        promesa: promesaCarga,
      };

      return promesaCarga;
    },
    [cacheDiputados],
  );

  const cargarSenadores = useCallback(
    async (circunscripcion, opciones = {}) => {
      const { forceRefresh = false } = opciones;

      if (!circunscripcion) {
        return [];
      }

      const mismaCircunscripcion =
        Number(cacheSenadores.circunscripcion) === Number(circunscripcion);

      const existenDatos = cacheSenadores.datos.length > 0;

      if (!forceRefresh && mismaCircunscripcion && existenDatos) {
        return cacheSenadores.datos;
      }

      /*
       * Si ya existe una consulta en curso para esta circunscripción,
       * reutilizamos la misma promesa.
       */
      if (
        cargaSenadoresEnCurso.current?.circunscripcion ===
        Number(circunscripcion)
      ) {
        return cargaSenadoresEnCurso.current.promesa;
      }

      const promesaCarga = (async () => {
        try {
          setLoadingSenadores(true);

          const data =
            await legisladoresRepository.getSenadoresByCircunscripcion(
              circunscripcion,
            );

          /*
           * Igual que con diputados, hacemos una copia antes de ordenar.
           * El orden queda almacenado en memoria y no cambia cada vez
           * que se vuelve a abrir la pantalla.
           */
          const senadoresOrdenados = [...data].sort(
            () => Math.random() - 0.5,
          );

          setCacheSenadores({
            datos: senadoresOrdenados,
            circunscripcion: Number(circunscripcion),
            fechaCarga: Date.now(),
          });

          return senadoresOrdenados;
        } catch (error) {
          console.error(
            "Error al cargar senadores desde DataContext:",
            error,
          );

          return [];
        } finally {
          setLoadingSenadores(false);
          cargaSenadoresEnCurso.current = null;
        }
      })();

      cargaSenadoresEnCurso.current = {
        circunscripcion: Number(circunscripcion),
        promesa: promesaCarga,
      };

      return promesaCarga;
    },
    [cacheSenadores],
  );

  /**
   * Obliga a volver a consultar los diputados del distrito.
   */
  const refrescarDiputados = useCallback(
    async (distrito) => {
      return cargarDiputados(distrito, {
        forceRefresh: true,
      });
    },
    [cargarDiputados],
  );

  const refrescarSenadores = useCallback(
    async (circunscripcion) => {
      return cargarSenadores(circunscripcion, {
        forceRefresh: true,
      });
    },
    [cargarSenadores],
  );

  /**
   * Actualiza un elemento dentro de una colección almacenada.
   *
   * cambios puede ser:
   *
   * 1. Un objeto:
   *    actualizarColeccion("diputados", id, {
   *      totalLikes: 15,
   *    });
   *
   * 2. Una función:
   *    actualizarColeccion("diputados", id, diputado => ({
   *      totalLikes: diputado.totalLikes + 1,
   *    }));
   */
  const actualizarColeccion = useCallback((nombreColeccion, id, cambios) => {
    switch (nombreColeccion) {
      case "diputados":
        setCacheDiputados((prev) => ({
          ...prev,
          datos: prev.datos.map((item) => {
            if (item.id !== id) {
              return item;
            }

            const cambiosCalculados =
              typeof cambios === "function" ? cambios(item) : cambios;

            return {
              ...item,
              ...cambiosCalculados,
            };
          }),
        }));
        break;

      case "senadores":
        setCacheSenadores((prev) => ({
          ...prev,
          datos: prev.datos.map((item) => {
            if (item.id !== id) {
              return item;
            }

            const cambiosCalculados =
              typeof cambios === "function" ? cambios(item) : cambios;

            return {
              ...item,
              ...cambiosCalculados,
            };
          }),
        }));
        break;

      default:
        console.warn(
          `La colección "${nombreColeccion}" no existe en DataContext.`,
        );
    }
  }, []);

  /**
   * Envoltorio cómodo para actualizar diputados.
   *
   * Internamente utiliza la función genérica.
   */
  const actualizarDiputado = useCallback(
    (id, cambios) => {
      actualizarColeccion("diputados", id, cambios);
    },
    [actualizarColeccion],
  );

  const actualizarSenador = useCallback(
    (id, cambios) => {
      actualizarColeccion("senadores", id, cambios);
    },
    [actualizarColeccion],
  );

  const actualizarTotalLikesRepresentante = useCallback(
    (idRepresentante, nuevoTotal) => {
      if (!idRepresentante) return;

      const totalNormalizado = Math.max(Number(nuevoTotal) || 0, 0);

      // Total global accesible desde cualquier pantalla.
      setTotalesLikesRepresentantes((prev) => ({
        ...prev,
        [idRepresentante]: totalNormalizado,
      }));

      // Lista normal de diputados del distrito.
      setCacheDiputados((prev) => ({
        ...prev,
        datos: prev.datos.map((item) =>
          String(item.id) === String(idRepresentante)
            ? {
              ...item,
              totalLikes: totalNormalizado,
            }
            : item,
        ),
      }));

      // Lista normal de senadores de la circunscripción.
      setCacheSenadores((prev) => ({
        ...prev,
        datos: prev.datos.map((item) =>
          String(item.id) === String(idRepresentante)
            ? {
              ...item,
              totalLikes: totalNormalizado,
            }
            : item,
        ),
      }));

      // Detalle almacenado del representante.
      setCacheDetalleDiputados((prev) => {
        const detalleActual = prev[idRepresentante];

        if (!detalleActual) {
          return prev;
        }

        return {
          ...prev,
          [idRepresentante]: {
            ...detalleActual,
            datos: {
              ...detalleActual.datos,
              diputadoCompleto: detalleActual.datos?.diputadoCompleto
                ? {
                  ...detalleActual.datos.diputadoCompleto,
                  totalLikes: totalNormalizado,
                }
                : detalleActual.datos?.diputadoCompleto,
            },
          },
        };
      });

      setCacheDetalleSenadores((prev) => {
        const detalleActual = prev[idRepresentante];

        if (!detalleActual) {
          return prev;
        }

        return {
          ...prev,
          [idRepresentante]: {
            ...detalleActual,
            datos: {
              ...detalleActual.datos,
              senadorCompleto: detalleActual.datos?.senadorCompleto
                ? {
                  ...detalleActual.datos.senadorCompleto,
                  totalLikes: totalNormalizado,
                }
                : detalleActual.datos?.senadorCompleto,
            },
          },
        };
      });
    },
    [],
  );

  const obtenerDiputado = useCallback(
    (id) => {
      return cacheDiputados.datos.find((diputado) => diputado.id === id);
    },
    [cacheDiputados],
  );

  const obtenerSenador = useCallback(
    (id) => {
      return cacheSenadores.datos.find((senador) => senador.id === id);
    },
    [cacheSenadores],
  );

  const obtenerDetalleDiputado = useCallback(
    (idDiputado) => {
      return cacheDetalleDiputados[idDiputado]?.datos ?? null;
    },
    [cacheDetalleDiputados],
  );

  const cargarDetalleDiputado = useCallback(
    async (
      idDiputado,
      cargarDesdeRepositorio,
      { forceRefresh = false } = {},
    ) => {
      if (!idDiputado || typeof cargarDesdeRepositorio !== "function") {
        return null;
      }

      const detalleEnCache = cacheDetalleDiputados[idDiputado]?.datos ?? null;

      if (detalleEnCache && !forceRefresh) {
        return detalleEnCache;
      }

      if (cargasDetalleDiputadosEnCurso.current[idDiputado] && !forceRefresh) {
        return cargasDetalleDiputadosEnCurso.current[idDiputado];
      }

      const promesaCarga = (async () => {
        try {
          const datos = await cargarDesdeRepositorio();

          setCacheDetalleDiputados((prev) => ({
            ...prev,
            [idDiputado]: {
              datos,
              fechaCarga: new Date(),
            },
          }));

          return datos;
        } finally {
          delete cargasDetalleDiputadosEnCurso.current[idDiputado];
        }
      })();

      cargasDetalleDiputadosEnCurso.current[idDiputado] = promesaCarga;

      return promesaCarga;
    },
    [cacheDetalleDiputados],
  );

  const obtenerDetalleSenador = useCallback(
    (idSenador) => {
      return cacheDetalleSenadores[idSenador]?.datos ?? null;
    },
    [cacheDetalleSenadores],
  );

  const cargarDetalleSenador = useCallback(
    async (
      idSenador,
      cargarDesdeRepositorio,
      { forceRefresh = false } = {},
    ) => {
      if (!idSenador || typeof cargarDesdeRepositorio !== "function") {
        return null;
      }

      const detalleEnCache = cacheDetalleSenadores[idSenador]?.datos ?? null;

      if (detalleEnCache && !forceRefresh) {
        return detalleEnCache;
      }

      if (cargasDetalleSenadoresEnCurso.current[idSenador] && !forceRefresh) {
        return cargasDetalleSenadoresEnCurso.current[idSenador];
      }

      const promesaCarga = (async () => {
        try {
          const datos = await cargarDesdeRepositorio();

          setCacheDetalleSenadores((prev) => ({
            ...prev,
            [idSenador]: {
              datos,
              fechaCarga: new Date(),
            },
          }));

          return datos;
        } finally {
          delete cargasDetalleSenadoresEnCurso.current[idSenador];
        }
      })();

      cargasDetalleSenadoresEnCurso.current[idSenador] = promesaCarga;

      return promesaCarga;
    },
    [cacheDetalleSenadores],
  );

  /**
   * Elimina toda la información almacenada en memoria.
   *
   * Más adelante la conectaremos con el cierre de sesión.
   */
  const limpiarCache = useCallback(() => {
    setCacheDiputados(estadoInicialDiputados);
    setCacheSenadores(estadoInicialSenadores);

    setCacheDetalleDiputados({});
    setCacheDetalleSenadores({});
    setTotalesLikesRepresentantes({});

    cargaDiputadosEnCurso.current = null;
    cargaSenadoresEnCurso.current = null;
    cargasDetalleDiputadosEnCurso.current = {};
    cargasDetalleSenadoresEnCurso.current = {};

    setLoadingDiputados(false);
    setLoadingSenadores(false);
  }, []);

  const value = useMemo(
    () => ({
      diputados: cacheDiputados.datos,
      distritoDiputados: cacheDiputados.distrito,
      fechaCargaDiputados: cacheDiputados.fechaCarga,
      loadingDiputados,

      cargarDiputados,
      refrescarDiputados,

      senadores: cacheSenadores.datos,
      circunscripcionSenadores: cacheSenadores.circunscripcion,
      fechaCargaSenadores: cacheSenadores.fechaCarga,
      loadingSenadores,

      cargarSenadores,
      refrescarSenadores,
      obtenerSenador,
      actualizarSenador,

      actualizarColeccion,
      actualizarDiputado,
      obtenerDiputado,

      cacheDetalleDiputados,
      obtenerDetalleDiputado,
      cargarDetalleDiputado,
      cacheDetalleSenadores,
      obtenerDetalleSenador,
      cargarDetalleSenador,

      totalesLikesRepresentantes,
      actualizarTotalLikesRepresentante,

      limpiarCache,
    }),
    [
      cacheDiputados,
      loadingDiputados,
      cargarDiputados,
      refrescarDiputados,

      cacheSenadores,
      loadingSenadores,
      cargarSenadores,
      refrescarSenadores,
      obtenerSenador,
      actualizarSenador,
      cacheDetalleSenadores,
      obtenerDetalleSenador,
      cargarDetalleSenador,

      actualizarColeccion,
      actualizarDiputado,
      obtenerDiputado,
      cacheDetalleDiputados,
      obtenerDetalleDiputado,
      cargarDetalleDiputado,
      totalesLikesRepresentantes,
      actualizarTotalLikesRepresentante,
      limpiarCache,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData debe utilizarse dentro de DataProvider");
  }

  return context;
};
