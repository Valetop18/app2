import "react-native-gesture-handler";
import React from "react";
import { useFonts } from "expo-font";
import MainNavigation from "./navigation/index";
import { Sedan_400Regular } from "@expo-google-fonts/sedan";
import {
  Manrope_500Medium,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { BuscadorProvider } from "./context/BuscadorContext";
import { AuthProvider } from "./context/AuthContext";
import { TooltipProvider } from "./context/TooltipProvider";
import { ReaccionesProvider } from "./context/ReaccionesContext";
import { DataProvider } from "./context/DataContext";
import { Text, TextInput } from "react-native";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.maxFontSizeMultiplier = 1.05;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.maxFontSizeMultiplier = 1.05;

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
