import React from "react";
import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Senadores } from "../screens/sena";
import { DescripcionSenador } from "../screens/detallesSena";

const Stack = createNativeStackNavigator()

const NaveSenadores = () => {
    return (
        <Stack.Navigator initialRouteName='Senadores' screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name='Senadores' component={Senadores} options={{title: 'Senadores'}} />
            <Stack.Screen name='Descripcion' component={DescripcionSenador} options={({route}) => ({title: route.params.nombre})} />
        </Stack.Navigator>
    )
}

export default NaveSenadores;