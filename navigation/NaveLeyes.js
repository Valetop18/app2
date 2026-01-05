import React from "react";
import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Leyes } from "../screens/legislatura";
import { LeyCompleta } from "../screens/leyCompleta";

const Stack = createNativeStackNavigator()

const NaveLeyes = () => {
    return (
        <Stack.Navigator initialRouteName='Legislatura' screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name='Legislatura' component={Leyes} options={{title: 'Legislatura'}} />
            <Stack.Screen name='LeyDetalle' component={LeyCompleta} options={({route}) => ({title: route.params.nombre})} />
        </Stack.Navigator>
    )
}

export default NaveLeyes;