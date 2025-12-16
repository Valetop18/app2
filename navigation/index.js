import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import Login from "../screens/login";
import MyDrawer from "./drawer";
import Registro from "../screens/registro";
import { Splash } from "../screens/Splash";
import { TopicosInteres } from "../screens/TopicosInteres";
import { PartidoUsuario } from "../screens/PartidoUsuario";
import SelectDistrito from "../screens/selectDistrito";
import { Maqueta } from "../screens/Maqueta";
import { DescripcionDiputado } from "../screens/detallesDipu";

const MainNavigation = () => {
  const userID = useSelector((state) => state.auth.token);


  const isAuthenticated = !!userID;




  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {
            isAuthenticated ? (
              <>
                <Stack.Screen name="MyDrawer" component={MyDrawer} />

              </>
            ) : (
            <>
              <Stack.Screen name="Splash" component={Splash} />
              
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ title: "Login" }}
              />

              <Stack.Screen name="Registro" component={Registro} />
              <Stack.Screen name="SelectDistrito" component={SelectDistrito} />
              <Stack.Screen name="TopicosInteres" component={TopicosInteres} />
              <Stack.Screen name="PartidoUsuario" component={PartidoUsuario} />
            </>  

            )
          }

        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
