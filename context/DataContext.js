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

export const DataProvider = ({ children }) => {
  const [cacheDiputados, setCacheDiputados] = useState(estadoInicialDiputados);
  const [cacheDetalleDiputados, setCacheDetalleDiputados] = useState({});
  const cargasDetalleDiputadosEnCurso = useRef({});

  const [loadingDiputados, setLoadingDiputados] = useState(false);

  /*
   * Evita hacer dos consultas simultáneas si dos componentes
   * solicitan los diputados del mismo distrito al mismo tiempo.
   */
  const cargaDiputadosEnCurso = useRef(null);

  /**
   * Obtiene diputados desde memoria o desde el repositorio.
   *
   * Si ya existen datos para el mismo distrito, devuelve el caché.
   * Si forceRefresh es true, vuelve a consultar aunque exista caché.
   */
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

  const obtenerDiputado = useCallback(
    (id) => {
      return cacheDiputados.datos.find((diputado) => diputado.id === id);
    },
    [cacheDiputados],
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

  /**
   * Elimina toda la información almacenada en memoria.
   *
   * Más adelante la conectaremos con el cierre de sesión.
   */
  const limpiarCache = useCallback(() => {
    setCacheDiputados(estadoInicialDiputados);

    setCacheDetalleDiputados({});

    cargaDiputadosEnCurso.current = null;
    cargasDetalleDiputadosEnCurso.current = {};

    setLoadingDiputados(false);
  }, []);

  const value = useMemo(
    () => ({
      diputados: cacheDiputados.datos,
      distritoDiputados: cacheDiputados.distrito,
      fechaCargaDiputados: cacheDiputados.fechaCarga,
      loadingDiputados,

      cargarDiputados,
      refrescarDiputados,

      actualizarColeccion,
      actualizarDiputado,
      obtenerDiputado,

      cacheDetalleDiputados,
      obtenerDetalleDiputado,
      cargarDetalleDiputado,

      limpiarCache,
    }),
    [
      cacheDiputados,
      loadingDiputados,
      cargarDiputados,
      refrescarDiputados,
      actualizarColeccion,
      actualizarDiputado,
      obtenerDiputado,
      cacheDetalleDiputados,
      obtenerDetalleDiputado,
      cargarDetalleDiputado,
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
