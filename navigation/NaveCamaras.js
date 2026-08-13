import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  Platform,
  useWindowDimensions,
} from "react-native";
import { COLORS } from "../constants/colors";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";

import { CamaraDipu } from "../screens/Camaras";
import { CamaraSena } from "../screens/Senado";
import { FONTS } from "../constants/fonts";

const Stack = createMaterialTopTabNavigator();

const responsiveTabSize = (baseValue) => {
  return Math.min(
    responsiveWidthScale(baseValue),
    responsiveHeightScale(baseValue),
  );
};

const responsiveTabText = (baseValue) => {
  return Math.max(11, responsiveTabSize(baseValue));
};

const NaveCamaras = () => {
  const { width, height } = useWindowDimensions();

  const esTelefonoBajo =
    Platform.OS === "android" &&
    width <= 375 &&
    height <= 680 &&
    height > width;

  return (
    <Stack.Navigator
      initialRoute="Camaras"
      screenOptions={{
        headerShown: false,

        tabBarLabelStyle: {
          fontSize: responsiveTabText(16.5),
          fontFamily: FONTS.bold,
          margin: 0,
          transform: [
            {
              translateY: esTelefonoBajo
                ? -9
                : -responsiveTabSize(2),
            },
          ],
        },

        tabBarInactiveTintColor: COLORS.greyM,
        tabBarActiveTintColor: COLORS.back,

        tabBarIndicatorStyle: {
          height: responsiveHeightScale(48),
          backgroundColor: COLORS.greenM,
        },

        tabBarStyle: {

          height: responsiveHeightScale(48),
          backgroundColor: COLORS.verdeclaro,
          elevation: 0,
        },

        tabBarItemStyle: {
          height: responsiveHeightScale(48),
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
