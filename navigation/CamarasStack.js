import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NaveCamaras from "./NaveCamaras";
import { EstadisticaPartido } from "../screens/EstadisticaPartido";
import { EstadisticaPartidoSenado } from "../screens/EstadisticaPartidoSenado";
import { DescripcionDiputado } from "../screens/detallesDipu";
import { DescripcionSenador } from "../screens/detallesSena";

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

        <Stack.Screen name='Descripcion' component={DescripcionDiputado}   />
        <Stack.Screen name="DescripcionSenador" component={DescripcionSenador} />


    </Stack.Navigator>)

}

export default CamarasStack;