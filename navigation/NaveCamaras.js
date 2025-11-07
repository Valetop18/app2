import React from "react";
import { Platform } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { CamaraDipu } from "../screens/Camaras";
import { CamaraSena } from "../screens/CamaraSena";


const Stack = createMaterialTopTabNavigator()

const NaveCamaras = () => {
    return (
        <Stack.Navigator initialRoute='Camaras' screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name='CamaraDipu' component={CamaraDipu} options={{title: 'Cámara de Diputados'}} />
            <Stack.Screen name='CamaraSena' component={CamaraSena} options={{title: 'Cámara de Senadores'}} />
        </Stack.Navigator>
    )
}

export default NaveCamaras;