import React from "react";
import { Platform } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { COLORS } from "../constants/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CamaraDipu } from "../screens/Camaras";
import { CamaraSena } from "../screens/Senado";
import { EstadisticaPartido } from "../screens/EstadisticaPartido";
import { FONTS } from "../constants/fonts";

const Stack = createMaterialTopTabNavigator();
const StackNative = createNativeStackNavigator();

const NaveCamaras = () => {
  return (
    <Stack.Navigator
      initialRoute="Camaras"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 16.5,
          fontFamily: FONTS.bold,
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
        name="CámaraDipu"
        component={CamaraDipu}
        options={{ title: "Cámara de Diputados" }}
      />
      <Stack.Screen
        name="CámaraSena"
        component={CamaraSena}
        options={{ title: "Cámara de Senadores" }}
      />
    </Stack.Navigator>
  );
};

export default NaveCamaras;
