import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import MainNavigation from "./navigation/index";
import { Sedan_400Regular } from "@expo-google-fonts/sedan";
import {
  Manrope_500Medium,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { BuscadorProvider } from "./context/BuscadorContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TooltipProvider } from "./context/TooltipProvider";
import { ReaccionesProvider } from "./context/ReaccionesContext";
import { DataProvider } from "./context/DataContext";
import { Text, TextInput } from "react-native";
import {
  obtenerUltimaNotificacionAbierta,
  registerCurrentDeviceForPushNotifications,
  suscribirEventosNotificaciones
} from "./infrastructure/pushNotifications";
import { OnboardingProvider } from "./context/OnboardingContext";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.maxFontSizeMultiplier = 1.05;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.maxFontSizeMultiplier = 1.05;

function RegistrarNotificaciones() {
  const { user, loading } = useAuth();

  useEffect(() => {

    if (loading || !user?.id) return;

    let active = true;

    async function registerDevice() {
      try {
        const result = await registerCurrentDeviceForPushNotifications(user.id);

        if (active) {
          console.log("Resultado registro notificaciones: ", result.status);
        }

      } catch (error) {

        if (active) {
          console.error("No se pudo registrar el dispositivo para notificaciones", error)
        }

      }
    }

    registerDevice();

    return () => {
      active = false;
    }



  }, [loading, user?.id])


}

export default function App() {

  function EscucharEventosNotificaciones() {

    useEffect(() => {

      let active = true;
      const openedNotifications = new Set();

      function handleOpenedNotifications(notification, source) {
        if (!active) return;

        const eventId = `${notification.identifier}:${notification.actionIdentifier}`;

        if (openedNotifications.has(eventId)) return;

        openedNotifications.add(eventId);
        console.log(`Notificacion abierta (${source}): `, notification);

      }

      const unsubscribe = suscribirEventosNotificaciones({
        alRecibir: (notification) => {
          if (active) {
            console.log("Notificacion recibida: ", notification)
          }
        },
        alAbrir: (notification) => {
          handleOpenedNotifications(notification, "listener");
        }
      });

      async function revisarNotificacionInicial() {

        try {
          const notificacion = await obtenerUltimaNotificacionAbierta();

          if (notificacion) {
            handleOpenedNotifications(notificacion, "inicio")
          }
        } catch (error) {
          if (active) {
            console.error("no se pudo leer la notificacion inicial: ", error)
          }
        }

      }


    }, [])

  }
  let [fontsLoaded] = useFonts({
    Sedan_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }



  return (
    <AuthProvider>
      <RegistrarNotificaciones />
      <OnboardingProvider>
        <BuscadorProvider>
          <TooltipProvider>
            <ReaccionesProvider>
              <DataProvider>
                <MainNavigation />
              </DataProvider>
            </ReaccionesProvider>
          </TooltipProvider>
        </BuscadorProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}
