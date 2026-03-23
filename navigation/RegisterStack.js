import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TopicosInteres } from "../screens/TopicosInteres";
import { PartidoUsuario } from "../screens/PartidoUsuario";

const Stack = createNativeStackNavigator();

export function RegisterStack() {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>

            <Stack.Screen name="TopicosInteres" component={TopicosInteres} />
            <Stack.Screen name="PartidoUsuario" component={PartidoUsuario} />

        </Stack.Navigator>
    )
}