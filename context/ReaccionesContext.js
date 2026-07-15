import React, { createContext, useContext, useEffect, useState } from "react";
import { reaccionesRepository } from "../infrastructure/ReaccionesRepository";
import { useAuth } from "./AuthContext";

const ReaccionesContext = createContext();

export const ReaccionesProvider = ({ children }) => {
  const { user } = useAuth();
  const [reaccionesLey, setReaccionesLey] = useState({});

  useEffect(() => {
    const cargarReacciones = async () => {
      if (!user?.id) return;

      const data = await reaccionesRepository.getReacciones(user.id, "ley");

      const map = {};
      data?.forEach((r) => {
        map[r.target_id] = r.tipo_reaccion;
      });

      setReaccionesLey(map);
    };

    cargarReacciones();
  }, [user?.id]);

  const setReaccionLey = async (idVotacion, tipoReaccion) => {
    if (!user?.id || !idVotacion) return null;

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

  return (
    <ReaccionesContext.Provider
      value={{
        reaccionesLey,
        setReaccionLey,
      }}
    >
      {children}
    </ReaccionesContext.Provider>
  );
};

export const useReacciones = () => useContext(ReaccionesContext);
