import "react-native-gesture-handler";
import { React, useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@react-native-vector-icons/ionicons";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { COLORS } from "../../constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  msFavorite,
  msDirectorySync,
  msLogout,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";

import SelectDistrito from "../../screens/selectDistrito";
import { Presentacion } from "../../screens/presentacion";

import NaveCamaras from "../NaveCamaras";
import CamarasStack from "../CamarasStack";
import NaveDiputados from "../NaveDiputados";
import NaveSenadores from "../NaveSenadores";
import NaveLeyes from "../NaveLeyes";


import { changeDistrit } from "../../store/actions/diputado.action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationState } from "@react-navigation/native";
import Buscador from "../../components/Buscador";
import { BuscadorContext } from "../../context/BuscadorContext";
import { LEYES } from "../../data/leyes";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const BottomsTabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function CustomDrawerContent(props) {

  const { logout } = useAuth();

  const dispatch = useDispatch();
  const navigation = useNavigation();



  const submit = async () => {

    logout();
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("pass");
    dispatch(changeDistrit());

    console.log("logout");
  };

  const cambioDistrito = () => {
    navigation.navigate('SelectDistrito');
    //dispatch(changeDistrit());
  };



  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: COLORS.greenM, marginTop: 0, paddingTop: 70 }}
    >
      <DrawerItemList {...props} />
      <DrawerItem
        pressOpacity={0.5}
        icon={({ focused, color, size }) => (
          <MsIcon icon={msDirectorySync} size={16} color={COLORS.back} />
        )}
        label="Cambio de distrito"
        onPress={cambioDistrito}
        labelStyle={{
          fontFamily: "NotoSansMyanmar_700Bold",
          fontSize: 14,
          margin: 0,
        }}
        style={{ marginLeft: "-6%", borderRadius: 0, width: 500, height: 48 }}
        activeBackgroundColor={COLORS.verdeclaro}
        activeTintColor={COLORS.greenM}
        inactiveBackgroundColor={COLORS.greenM}
        inactiveTintColor={COLORS.back}
        pressColor={COLORS.back}
      />
      <DrawerItem
        icon={({ focused, color, size }) => (
          <MsIcon icon={msLogout} size={16} color={COLORS.back} />
        )}
        label="Cerrar Sesión"
        onPress={submit}
        labelStyle={{
          fontFamily: "NotoSansMyanmar_700Bold",
          fontSize: 14,
          margin: 0,
        }}
        style={{ marginLeft: "-6%", borderRadius: 0, width: 500, height: 48 }}
        activeBackgroundColor={COLORS.verdeclaro}
        activeTintColor={COLORS.greenM}
        inactiveBackgroundColor={COLORS.greenM}
        inactiveTintColor={COLORS.back}
        pressColor={COLORS.back}
      />
    </DrawerContentScrollView>
  );
}

const MyDrawer = () => {


  const { user, distrito } = useAuth();

  const filteredDiputados = useSelector(
    (state) => state.selectDiputado.filteredDiputados
  );
  const rutaActiva = useNavigationState((state) => {
    const index = state.index;
    let route = state.routes[index];

    while (route.state && route.state.routes) {
      route = route.state.routes[route.state.index];
    }

    return route;
  });

  const fromEstadisticaPartido = (rutaActiva, from ) => {
    return (
      rutaActiva?.name === "Descripcion" &&
      rutaActiva?.params?.from === from
    )
  }


  return (
    <>
        <>
        <Drawer.Navigator
          useLegacyImplementation
          screenOptions={({ navigation }) => ({
            headerTintColor: COLORS.greenM,
            headerTitleStyle: {
              fontFamily: "NotoSansMyanmar_700Bold",
              fontSize: 25,
              letterSpacing: 2,
            },
            drawerPosition: "right",
            headerRight: () => {
              return (
                <>
                  <Pressable onPress={() => navigation.openDrawer()}>
                    <MaterialIcons
                      name="workspaces-outline"
                      size={26}
                      color={COLORS.greenM}
                      style={{ marginRight: 25 }}
                    />
                  </Pressable>
                </>
              );
            },
            headerLeftContainerStyle: { width: "5%" },
            headerLeft: false,
            headerStyle: { backgroundColor: COLORS.back, elevation: 0 },
            drawerStyle: {
              backgroundColor: COLORS.greenM,
              width: "50%",
              height: "100%",
              borderRadius: 0,
            },
            drawerActiveBackgroundColor: COLORS.verdeclaro,
            drawerActiveTintColor: COLORS.greenM,
            drawerInactiveBackgroundColor: COLORS.greenM,
            drawerInactiveTintColor: COLORS.back,
            drawerItemStyle: {
              marginLeft: "-6%",
              borderRadius: 0,
              width: 500,
              height: 48,
            },
            drawerLabelStyle: {
              fontFamily: "NotoSansMyanmar_700Bold",
              fontSize: 14,
              margin: 0,
            },
          })}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="Principal"
            options={{
              headerStyle: {
                backgroundColor: COLORS.back,
                elevation: 0,
              },
              headerTitle: () => {
                if (rutaActiva.name.includes("Cámara")) {
                  return <Buscador />
                }
                if (rutaActiva.name === "EstadisticaPartido") {
                  return <Text style={styles.header}>Cámara de diputados</Text>
                }
                if (rutaActiva.name === "EstadisticaPartidoSenado") {
                  return <Text style={styles.header}>Cámara de senadores</Text>
                }
                if(fromEstadisticaPartido(rutaActiva, "EstadistaPartidoDiputado")){
                  return <Text style={styles.header}>Cámara de diputados</Text>
                }
                if(fromEstadisticaPartido(rutaActiva, "EstadistaPartidoSenador")){
                  return <Text style={styles.header}>Cámara de senadores</Text>
                }
                if(rutaActiva.name === "Senadores" || rutaActiva.name === "DescripcionSenador"){
                  return <Text style={styles.header}>Circunscripción {user?.circunscripcion}</Text>
                }
                return <Text style={styles.header}>Distrito {user?.distrito}</Text>
              },
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="home-sharp"
                  size={16}
                  color={focused ? COLORS.greenM : COLORS.back}
                  style={styles.icon} 
                />
              ),
            }}
          >

            {() => (
              <BottomsTabs.Navigator
                screenOptions={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor:
                      Platform.OS === "android" ? COLORS.greenM : COLORS.grey,
                  },
                  headerTintColor:
                    Platform.OS === "android" ? COLORS.greenM : COLORS.grey,
                  tabBarStyle: styles.tabBar,
                  tabBarLabelStyle: {
                    fontSize: 12.5,
                    fontFamily: "NotoSansMyanmar_400Regular",
                    color: COLORS.black,
                  },
                  tabBarIconStyle: {
                    width: 36,
                    height: 36,
                    marginTop: 5
                  },
                  tabBarHideOnKeyboard: true,
                }}
              >
                {/* forzar keyboard avoiding */}

                <BottomsTabs.Screen
                  name="Diputados"
                  component={NaveDiputados}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <View style={styles.item}>
                        <Ionicons
                          name="people-circle"
                          size={36}
                          color={focused ? COLORS.greenM : COLORS.grey}
                        />
                      </View>
                    ),
                  }}
                />

                <BottomsTabs.Screen
                  name="Senadores"
                  component={NaveSenadores}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <View style={styles.item}>
                        <Ionicons
                          name="people-circle-outline"
                          size={36}
                          color={focused ? COLORS.greenM : COLORS.grey}
                        />
                      </View>
                    ),
                  }}
                />
                <BottomsTabs.Screen
                  name="Cámaras"
                  component={CamarasStack}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <View style={styles.item}>
                        <MaterialCommunityIcons
                          name="chart-donut-variant"
                          size={36}
                          color={focused ? COLORS.greenM : COLORS.grey}
                        />
                      </View>
                    ),
                  }}
                />
              </BottomsTabs.Navigator>
            )}
          </Drawer.Screen>
          <Drawer.Screen
            name="Presentación"
            component={Presentacion}
            options={{
              drawerIcon: ({ focused, size }) => (
                <MsIcon
                  icon={msFavorite}
                  size={16}
                  color={focused ? COLORS.greenM : COLORS.back}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Legislatura"
            component={NaveLeyes}
            options={{
              drawerIcon: ({ focused, size }) => (
                <MaterialIcons
                  name="how-to-vote"
                  size={16}
                  color={focused ? COLORS.greenM : COLORS.back}
                />
              ),
            }}
          />

        </Drawer.Navigator>

</>
      
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: "9.5%",
    justifyContent: "center",
    backgroundColor: COLORS.back,
    width: "100%",
    elevation: 0,
    shadowColor: "transparent",
    borderTopWidth: 0,
  },
  item: {},
  label: {
    fontFamily: "NotoSansMyanmar_400Regular",
    color: COLORS.black,
    fontSize: 12,
  },
  icon: {},
  header: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 26,
    letterSpacing: 2,
    color: COLORS.greenM,
  },
  buscador: {},
});

export default MyDrawer;
