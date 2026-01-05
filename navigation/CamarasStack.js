import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NaveCamaras from "./NaveCamaras";
import { EstadisticaPartido } from "../screens/EstadisticaPartido";
import { EstadisticaPartidoSenado } from "../screens/EstadisticaPartidoSenado";

const Stack = createNativeStackNavigator();

const CamarasStack = () => {

    return (<Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen
            name="CámarasTabs"
            component={NaveCamaras}
        />

        <Stack.Screen
            name="EstadisticaPartido"
            component={EstadisticaPartido}
        />

        <Stack.Screen
            name="EstadisticaPartidoSenado"
            component={EstadisticaPartidoSenado}
        />

    </Stack.Navigator>)

}

export default CamarasStack;