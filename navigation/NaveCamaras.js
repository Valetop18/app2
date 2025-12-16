import React from "react";
import { Platform } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { COLORS } from "../constants/colors";

import { CamaraDipu } from "../screens/Camaras";
import { CamaraSena } from "../screens/CamaraSena";

const Stack = createMaterialTopTabNavigator();

const NaveCamaras = () => {
  return (
    <Stack.Navigator
      initialRoute="Camaras"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 15,
          fontFamily: "NotoSansMyanmar_700Bold",
        },
        tabBarInactiveTintColor: COLORS.greyM,
        tabBarActiveTintColor: COLORS.back,
        tabBarIndicatorStyle: {
          height: 48,
          backgroundColor: COLORS.greenM,
        },
        tabBarStyle: {
          backgroundColor: COLORS.verdeclaro,
          elevation: 0,
        },
        tabBarItemStyle: {
          height: 48,
          paddingVertical: 0,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarPressColor: COLORS.greenM,
        tabBarPressOpacity: 0.5,
      }}
    >
      <Stack.Screen
        name="CamaraDipu"
        component={CamaraDipu}
        options={{ title: "Cámara de Diputados" }}
      />
      <Stack.Screen
        name="CamaraSena"
        component={CamaraSena}
        options={{ title: "Cámara de Senadores" }}
      />
    </Stack.Navigator>
  );
};

export default NaveCamaras;
