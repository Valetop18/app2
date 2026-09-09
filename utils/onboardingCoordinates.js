import { Platform, StatusBar } from "react-native";

export const normalizarMedidaOnboarding = ({
  x,
  y,
  width,
  height,
}) => {
  const desplazamientoBarraEstado =
    Platform.OS === "android"
      ? StatusBar.currentHeight ?? 0
      : 0;

  return {
    x,
    y: y + desplazamientoBarraEstado,
    width,
    height,
  };
};