import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectDistrito from "../screens/selectDistrito";
import MyDrawer from "./drawer";
import { DescripcionDiputado } from "../screens/detallesDipu";

const Stack = createNativeStackNavigator();

export function UbicacionStack() {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>

          <Stack.Screen name="MyDrawer" component={MyDrawer} />
          <Stack.Screen
            name="SelectDistrito"
            component={SelectDistrito}
            options={{ headerBackVisible: false }}
          />
          <Stack.Screen name='DescripcionDiputado' component={DescripcionDiputado}   />
          

        </Stack.Navigator>
    )
}