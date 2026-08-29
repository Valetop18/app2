import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Senadores } from "../screens/sena";
import { DescripcionSenador } from "../screens/detallesSena";

const Stack = createNativeStackNavigator();

const NaveSenadores = () => {
  return (
    <Stack.Navigator
      initialRouteName="ListaSenadores"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ListaSenadores"
        component={Senadores}
        options={{ title: "Senadores" }}
      />

      <Stack.Screen
        name="DescripcionSenador"
        component={DescripcionSenador}
        options={({ route }) => ({
          title: route.params?.nombre,
        })}
      />
    </Stack.Navigator>
  );
};

export default NaveSenadores;