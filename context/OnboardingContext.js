import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const OnboardingContext = createContext(null);

const ONBOARDING_VERSION = "v1";

export const OnboardingProvider = ({ children }) => {
  const { user } = useAuth();

  const [activo, setActivo] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [cargandoOnboarding, setCargandoOnboarding] = useState(true);

  const obtenerClave = useCallback(() => {
    if (!user?.id) return null;

    return `@onboarding_nawi_${ONBOARDING_VERSION}_${user.id}`;
  }, [user?.id]);

  useEffect(() => {
    let efectoActivo = true;

    const cargarEstadoOnboarding = async () => {
      const clave = obtenerClave();

      if (!clave || !user?.distrito) {
        if (efectoActivo) {
          setActivo(false);
          setPasoActual(1);
          setCargandoOnboarding(false);
        }

        return;
      }

      try {
        setCargandoOnboarding(true);

        const onboardingCompletado = await AsyncStorage.getItem(clave);

        if (!efectoActivo) return;

        setPasoActual(1);
        setActivo(onboardingCompletado !== "true");
      } catch (error) {
        console.error("Error cargando el onboarding:", error);

        if (efectoActivo) {
          setActivo(false);
        }
      } finally {
        if (efectoActivo) {
          setCargandoOnboarding(false);
        }
      }
    };

    cargarEstadoOnboarding();

    return () => {
      efectoActivo = false;
    };
  }, [obtenerClave, user?.distrito]);

  const avanzarPaso = useCallback(() => {
    setPasoActual((pasoAnterior) => pasoAnterior + 1);
  }, []);

  const irAlPaso = useCallback((numeroPaso) => {
    setPasoActual(numeroPaso);
  }, []);

  const finalizarRecorrido = useCallback(async () => {
    const clave = obtenerClave();

    try {
      if (clave) {
        await AsyncStorage.setItem(clave, "true");
      }
    } catch (error) {
      console.error("Error guardando el onboarding:", error);
    } finally {
      setActivo(false);
      setPasoActual(1);
    }
  }, [obtenerClave]);

  const omitirRecorrido = useCallback(async () => {
    await finalizarRecorrido();
  }, [finalizarRecorrido]);

  const reiniciarRecorrido = useCallback(async () => {
    const clave = obtenerClave();

    try {
      if (clave) {
        await AsyncStorage.removeItem(clave);
      }

      setPasoActual(1);
      setActivo(true);
    } catch (error) {
      console.error("Error reiniciando el onboarding:", error);
    }
  }, [obtenerClave]);

  return (
    <OnboardingContext.Provider
      value={{
        activo,
        pasoActual,
        cargandoOnboarding,
        avanzarPaso,
        irAlPaso,
        omitirRecorrido,
        finalizarRecorrido,
        reiniciarRecorrido,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboarding debe utilizarse dentro de OnboardingProvider",
    );
  }

  return context;
};