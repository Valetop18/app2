import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Splash } from "../screens/Splash";
import Login from "../screens/login";
import Registro from "../screens/registro";

const Stack = createNativeStackNavigator();

export function AuthStack() {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>

            <Stack.Screen name="Splah" component={Splash}/>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ title: "Login" }}
            />
            <Stack.Screen name="Registro" component={Registro} />

        </Stack.Navigator>
    )
}