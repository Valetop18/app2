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
import { registerCurrentDeviceForPushNotifications } from "./infrastructure/pushNotifications";

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
          console.error("No se pudo registrar el dispositivo para notificaciones")
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
      <BuscadorProvider>
        <TooltipProvider>
          <ReaccionesProvider>
            <DataProvider>
              <MainNavigation />
            </DataProvider>
          </ReaccionesProvider>
        </TooltipProvider>
      </BuscadorProvider>
    </AuthProvider>
  );
}
