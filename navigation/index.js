import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import { useAuth } from "../context/AuthContext";
import { AuthStack } from "./AuthStack";
import { RegisterStack } from "./RegisterStack";
import { AppStack } from "./AppStack";

const MainNavigation = () => {
  const { user, tipoAuth } = useAuth();

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : tipoAuth === "register" ? (
        <RegisterStack />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

export default MainNavigation;
