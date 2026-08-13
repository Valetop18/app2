import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";
import { AuthStack } from "./AuthStack";
import { RegisterStack } from "./RegisterStack";
import { AppStack } from "./AppStack";
import { UbicacionStack } from "./UbicacionStack";
import { Splash } from "../screens/Splash";
import { SafeAreaProvider } from "react-native-safe-area-context";

const MainNavigation = () => {
  const { user, tipoAuth, loading } = useAuth();

  const [tiempoMinimoCumplido, setTiempoMinimoCumplido] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTiempoMinimoCumplido(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading || !tiempoMinimoCumplido) {
    return <Splash />;
  }

  const tieneUbicacion =
    !!user?.distrito && !!user?.circunscripcion;

  const navigationKey = !user
    ? "auth"
    : tipoAuth === "register"
      ? "register"
      : tieneUbicacion
        ? "con-ubicacion"
        : "sin-ubicacion";

  return (
    <SafeAreaProvider>
      <NavigationContainer key={navigationKey}>
        {!user ? (
          <AuthStack />
        ) : tipoAuth === "register" ? (
          <RegisterStack />
        ) : tieneUbicacion ? (
          <UbicacionStack />
        ) : (
          <AppStack />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default MainNavigation;