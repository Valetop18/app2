import React from "react";
import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Diputados } from "../screens/dipu";
import { DescripcionDiputado } from "../screens/detallesDipu";

const Stack = createNativeStackNavigator()

const NaveDiputados = () => {
    return (
        <Stack.Navigator initialRouteName='ListaDiputados' screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name='ListaDiputados' component={Diputados} options={{title: 'Diputados'}} />
            <Stack.Screen name='Descripcion' component={DescripcionDiputado} options={({route}) => ({title: route.params.nombre})} />
        </Stack.Navigator>
    )
}

export default NaveDiputados;