import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/login';
import Registro from '../screens/registro';

const Stack = createNativeStackNavigator();

const LoginNavigator = () => (
    <Stack.Navigator
        initialRouteNam='Login'
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
)

export default LoginNavigator;