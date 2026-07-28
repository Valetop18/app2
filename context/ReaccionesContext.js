import React, { createContext, useContext, useEffect, useState } from "react";
import { reaccionesRepository } from "../infrastructure/ReaccionesRepository";
import { useAuth } from "./AuthContext";

const ReaccionesContext = createContext();

export const ReaccionesProvider = ({ children }) => {
  const { user, puedeInteractuar } = useAuth();

  const [reaccionesLey, setReaccionesLey] = useState({});
  const [reaccionesRepresentante, setReaccionesRepresentante] = useState({});

  useEffect(() => {
    const cargarReacciones = async () => {
      if (!user?.id) return;

      const [dataLey, dataRepresentante] = await Promise.all([
        reaccionesRepository.getReacciones(user.id, "ley"),
        reaccionesRepository.getReacciones(user.id, "representante"),
      ]);

      const mapLey = {};
      dataLey?.forEach((r) => {
        mapLey[r.target_id] = r.tipo_reaccion;
      });

      const mapRepresentante = {};
      dataRepresentante?.forEach((r) => {
        mapRepresentante[r.target_id] = r.tipo_reaccion;
      });

      setReaccionesLey(mapLey);
      setReaccionesRepresentante(mapRepresentante);
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

    await reaccionesRepository.setReaccion(user.id, idVotacion, "ley", nueva);

    setReaccionesLey((prev) => ({
      ...prev,
      [idVotacion]: nueva,
    }));

    return {
      anterior: actual,
      nueva,
    };
  };

  const setReaccionRepresentante = async (idRepresentante, tipoReaccion) => {

  if (!user?.id || !idRepresentante) {
    console.log("Reacción detenida: falta usuario o representante");
    return null;
  }

  if (!puedeInteractuar) {
    console.log("Reacción detenida: puedeInteractuar es false");
    return null;
  }

  const actual = reaccionesRepresentante[idRepresentante] ?? null;
  const nueva = actual === tipoReaccion ? "null" : tipoReaccion;

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

  return (
    <ReaccionesContext.Provider
      value={{
        reaccionesLey,
        setReaccionLey,

        reaccionesRepresentante,
        setReaccionRepresentante,
      }}
    >
      {children}
    </ReaccionesContext.Provider>
  );
};

export const useReacciones = () => useContext(ReaccionesContext);
