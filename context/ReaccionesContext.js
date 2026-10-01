import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { reaccionesRepository } from "../infrastructure/ReaccionesRepository";
import { useAuth } from "./AuthContext";

const ReaccionesContext = createContext();

export const ReaccionesProvider = ({ children }) => {
  const { user, puedeInteractuar } = useAuth();

  const [reaccionesLey, setReaccionesLey] = useState({});
  const [reaccionesRepresentante, setReaccionesRepresentante] = useState({});
  const [reaccionesMocion, setReaccionesMocion] = useState({});
  const [reaccionesMocionSenado, setReaccionesMocionSenado] =
    useState({});

  useEffect(() => {
    const cargarReacciones = async () => {
      if (!user?.id) {
        setReaccionesLey({});
        setReaccionesRepresentante({});
        setReaccionesMocion({});
        setReaccionesMocionSenado({});
        return;
      }

      const [
        dataLey,
        dataRepresentante,
        dataMocion,
        dataMocionSenado,
      ] = await Promise.all([
        reaccionesRepository.getReacciones(user.id, "ley"),
        reaccionesRepository.getReacciones(user.id, "representante"),
        reaccionesRepository.getReacciones(user.id, "mocion"),
        reaccionesRepository.getReacciones(user.id, "mocion_senado"),
      ]);

      const mapLey = {};

      dataLey?.forEach((reaccion) => {
        mapLey[reaccion.target_id] = reaccion.tipo_reaccion;
      });

      const mapRepresentante = {};

      dataRepresentante?.forEach((reaccion) => {
        mapRepresentante[reaccion.target_id] =
          reaccion.tipo_reaccion;
      });

      const mapMocion = {};

      dataMocion?.forEach((reaccion) => {
        mapMocion[reaccion.target_id] = reaccion.tipo_reaccion;
      });

      const mapMocionSenado = {};

      dataMocionSenado?.forEach((reaccion) => {
        mapMocionSenado[reaccion.target_id] =
          reaccion.tipo_reaccion;
      });

      setReaccionesLey(mapLey);
      setReaccionesRepresentante(mapRepresentante);
      setReaccionesMocion(mapMocion);
      setReaccionesMocionSenado(mapMocionSenado);
    };

    cargarReacciones();
  }, [user?.id]);

  const setReaccionLey = async (idVotacion, tipoReaccion) => {
    if (!user?.id || !idVotacion) return null;

    if (!puedeInteractuar) {
      return null;
    }

    const actual = reaccionesLey[idVotacion] ?? null;
    const nueva = actual === tipoReaccion ? "null" : tipoReaccion;

    await reaccionesRepository.setReaccion(
      user.id,
      idVotacion,
      "ley",
      nueva,
    );

    setReaccionesLey((prev) => ({
      ...prev,
      [idVotacion]: nueva,
    }));

    return {
      anterior: actual,
      nueva,
    };
  };

  const setReaccionRepresentante = async (
    idRepresentante,
    tipoReaccion,
  ) => {
    if (!user?.id || !idRepresentante) {
      console.log("Reacción detenida: falta usuario o representante");
      return null;
    }

    if (!puedeInteractuar) {
      console.log("Reacción detenida: puedeInteractuar es false");
      return null;
    }

    const actual =
      reaccionesRepresentante[idRepresentante] ?? null;

    const nueva =
      actual === tipoReaccion ? "null" : tipoReaccion;

    await reaccionesRepository.setReaccion(
      user.id,
      idRepresentante,
      "representante",
      nueva,
    );

    setReaccionesRepresentante((prev) => ({
      ...prev,
      [idRepresentante]: nueva,
    }));

    return {
      anterior: actual,
      nueva,
    };
  };

  const setReaccionMocion = async (
    idMocion,
    tipoReaccion,
  ) => {
    if (!user?.id || !idMocion) {
      console.log("Reacción detenida: falta usuario o moción");
      return null;
    }

    if (!puedeInteractuar) {
      console.log("Reacción detenida: puedeInteractuar es false");
      return null;
    }

    const actual = reaccionesMocion[idMocion] ?? null;

    const nueva =
      actual === tipoReaccion ? "null" : tipoReaccion;

    await reaccionesRepository.setReaccion(
      user.id,
      idMocion,
      "mocion",
      nueva,
    );

    setReaccionesMocion((prev) => ({
      ...prev,
      [idMocion]: nueva,
    }));

    return {
      anterior: actual,
      nueva,
    };
  };

  const setReaccionMocionSenado = async (
    idMocion,
    tipoReaccion,
  ) => {
    if (!user?.id || !idMocion) {
      console.log(
        "Reacción detenida: falta usuario o moción del Senado",
      );
      return null;
    }

    if (!puedeInteractuar) {
      console.log("Reacción detenida: puedeInteractuar es false");
      return null;
    }

    const actual = reaccionesMocionSenado[idMocion] ?? null;

    const nueva =
      actual === tipoReaccion ? "null" : tipoReaccion;

    await reaccionesRepository.setReaccion(
      user.id,
      idMocion,
      "mocion_senado",
      nueva,
    );

    setReaccionesMocionSenado((prev) => ({
      ...prev,
      [idMocion]: nueva,
    }));

    return {
      anterior: actual,
      nueva,
    };
  };

  return (
    <ReaccionesContext.Provider
      value={{
        reaccionesLey,
        setReaccionLey,

        reaccionesRepresentante,
        setReaccionRepresentante,

        reaccionesMocion,
        setReaccionMocion,

        reaccionesMocionSenado,
        setReaccionMocionSenado,
      }}
    >
      {children}
    </ReaccionesContext.Provider>
  );
};

export const useReacciones = () => useContext(ReaccionesContext);