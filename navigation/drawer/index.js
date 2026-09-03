import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Pressable,
  useWindowDimensions,
  Modal
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
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../../utils/responsive";

import { COLORS } from "../../constants/colors";
import {
  msFavorite,
  msDirectorySync,
  msLogout,
  msGppMaybe,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";

import { Presentacion } from "../../screens/presentacion";

import CamarasStack from "../CamarasStack";
import NaveDiputados from "../NaveDiputados";
import NaveSenadores from "../NaveSenadores";
import NaveLeyes from "../NaveLeyes";

import { useNavigationState } from "@react-navigation/native";
import Buscador from "../../components/Buscador";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "../../constants/fonts";

const BottomsTabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const responsiveNavSize = (baseValue) => {
  return Math.min(
    responsiveWidthScale(baseValue),
    responsiveHeightScale(baseValue),
  );
};

const responsiveNavText = (baseValue, minValue = 11) => {
  return Math.max(minValue, responsiveNavSize(baseValue));
};

function CustomDrawerContent(props) {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const [modalDistritoVisible, setModalDistritoVisible] =
    useState(false);

  const { width, height } = useWindowDimensions();

  const esTelefonoBajo =
    Platform.OS === "android" &&
    width <= 375 &&
    height <= 680 &&
    height > width;

  const submit = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const cambioDistrito = () => {
    setModalDistritoVisible(true);
  };

  const cancelarCambioDistrito = () => {
    setModalDistritoVisible(false);
  };

  const aceptarCambioDistrito = () => {
    setModalDistritoVisible(false);
    navigation.navigate("SelectDistrito");
  };

  return (
    <>

      <Modal
        visible={modalDistritoVisible}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={cancelarCambioDistrito}
      >
        <View style={styles.modalDistritoOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={cancelarCambioDistrito}
          />

          <View style={styles.modalDistritoContainer}>
            <View style={styles.modalDistritoHeader}>
              <View style={styles.modalDistritoIcon}>
                <MaterialIcons
                  name="location-on"
                  size={responsiveNavSize(25)}
                  color={COLORS.greenM}
                />
              </View>

              <View style={styles.modalDistritoTitulos}>
                <Text style={styles.modalDistritoTitulo}>
                  Cambio de distrito
                </Text>

                <Text style={styles.modalDistritoSubtitulo}>
                  Actualización de ubicación electoral
                </Text>
              </View>

              <Pressable
                style={styles.modalDistritoCerrar}
                onPress={cancelarCambioDistrito}
                hitSlop={10}
              >
                <Ionicons
                  name="close"
                  size={responsiveNavSize(18)}
                  color={COLORS.greenM}
                />
              </Pressable>
            </View>

            <View style={styles.modalDistritoMensaje}>
              <Ionicons
                name="information-circle-outline"
                size={responsiveNavSize(20)}
                color={COLORS.greenM}
              />

              <Text style={styles.modalDistritoTexto}>
                El distrito solo puede cambiarse una vez cada 6 meses.
                Si continúas, podrás seleccionar nuevamente tu región y
                comuna.
              </Text>
            </View>

            <View style={styles.modalDistritoBotones}>
              <Pressable
                style={[
                  styles.modalDistritoBoton,
                  styles.modalDistritoCancelar,
                ]}
                onPress={cancelarCambioDistrito}
              >
                <Text style={styles.modalDistritoCancelarTexto}>
                  CANCELAR
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalDistritoBoton,
                  styles.modalDistritoAceptar,
                ]}
                onPress={aceptarCambioDistrito}
              >
                <Text style={styles.modalDistritoAceptarTexto}>
                  CONTINUAR
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <DrawerContentScrollView
        {...props}
        style={{
          backgroundColor: COLORS.greenM,
          marginTop: 0,
          paddingTop: responsiveHeightScale(70),
        }}
      >
        <DrawerItemList {...props} />
        <DrawerItem
          pressOpacity={0.5}
          icon={({ focused, color }) => (
            <MsIcon
              icon={msDirectorySync}
              size={responsiveNavSize(16)}
              color={COLORS.back}
            />
          )}
          label="Cambio de distrito"
          onPress={cambioDistrito}
          labelStyle={{
            fontFamily: FONTS.bold,
            fontSize: responsiveNavText(14),
            margin: 0,
          }}
          style={{
            marginLeft: esTelefonoBajo ? "-7%" : "-6%",
            borderRadius: 0,
            width: 500,
            ...(esTelefonoBajo && {
              height: 48,
              marginVertical: 0,
            }),
          }}
          activeBackgroundColor={COLORS.verdeclaro}
          activeTintColor={COLORS.greenM}
          inactiveBackgroundColor={COLORS.greenM}
          inactiveTintColor={COLORS.back}
          pressColor={COLORS.back}
        />
        <DrawerItem
          icon={({ focused, color }) => (
            <MsIcon
              icon={msLogout}
              size={responsiveNavSize(16)}
              color={COLORS.back}
            />
          )}
          label="Cerrar Sesión"
          onPress={submit}
          labelStyle={{
            fontFamily: FONTS.bold,
            fontSize: responsiveNavText(14),
            margin: 0,
          }}
          style={{
            marginLeft: esTelefonoBajo ? "-7%" : "-6%",
            borderRadius: 0,
            width: 500,
            ...(esTelefonoBajo && {
              height: 48,
              marginVertical: 0,
            }),
          }}
          activeBackgroundColor={COLORS.verdeclaro}
          activeTintColor={COLORS.greenM}
          inactiveBackgroundColor={COLORS.greenM}
          inactiveTintColor={COLORS.back}
          pressColor={COLORS.back}
        />
      </DrawerContentScrollView>
    </>);
}

const MyDrawer = () => {
  const { user } = useAuth();

  const { width, height } = useWindowDimensions();

  const esTelefonoBajo =
    Platform.OS === "android" &&
    width <= 375 &&
    height <= 680 &&
    height > width;

  const rutaActiva = useNavigationState((state) => {
    const index = state.index;
    let route = state.routes[index];

    while (route.state && route.state.routes) {
      route = route.state.routes[route.state.index];
    }

    return route;
  });

  const fromEstadisticaPartido = (rutaActiva, tipo) => {
    if (tipo === "senador") {
      return (
        rutaActiva?.name === "DescripcionSenador" &&
        rutaActiva?.params?.from === "EstadisticaPartidoSenado"
      );
    }

    return (
      rutaActiva?.name === "Descripcion" &&
      rutaActiva?.params?.from === "EstadisticaPartido"
    );
  };

  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={({ navigation }) => ({
        headerTintColor: COLORS.greenM,
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontFamily: FONTS.bold,
          fontSize: responsiveNavText(25),
          letterSpacing: responsiveWidthScale(2),
        },
        drawerPosition: "right",
        headerRight: () => (
          <Pressable onPress={() => navigation.openDrawer()} hitSlop={8}>
            <MaterialIcons
              name="workspaces-outline"
              size={responsiveNavSize(26)}
              color={COLORS.greenM}
              style={{
                marginRight: responsiveWidthScale(25),
                transform: rutaActiva.name.includes("Cámara")
                  ? [{ translateY: -responsiveNavSize(4) }]
                  : [],
              }}
            />
          </Pressable>
        ),
        headerLeftContainerStyle: { width: "5%" },
        headerLeft: false,
        headerStyle: {
          backgroundColor: COLORS.back,
          elevation: 0,
          shadowColor: "transparent",
          ...(esTelefonoBajo && {
            height: 55,
          }),
        },
        drawerStyle: {
          backgroundColor: COLORS.greenM,
          width: "50%",

          borderRadius: 0,
        },
        drawerActiveBackgroundColor: COLORS.verdeclaro,
        drawerActiveTintColor: COLORS.greenM,
        drawerInactiveBackgroundColor: COLORS.greenM,
        drawerInactiveTintColor: COLORS.back,
        drawerItemStyle: {
          marginLeft: esTelefonoBajo ? "-7%" : "-6%",
          borderRadius: 0,
          width: 500,
          ...(esTelefonoBajo && {
            height: 48,
            marginVertical: 0,
          }),
        },
        drawerLabelStyle: {
          fontFamily: FONTS.bold,
          fontSize: responsiveNavText(14),
          margin: 0,
        },
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Principal"
        options={{

          headerTitle: () => {
            if (rutaActiva.name.includes("Cámara")) {
              return <Buscador header />;
            }
            if (rutaActiva.name === "EstadisticaPartido") {
              return <Text style={styles.header}>Cámara de diputados</Text>;
            }
            if (rutaActiva.name === "EstadisticaPartidoSenado") {
              return <Text style={styles.header}>Cámara de senadores</Text>;
            }
            if (fromEstadisticaPartido(rutaActiva, "diputado")) {
              return <Text style={styles.header}>Cámara de diputados</Text>;
            }

            if (fromEstadisticaPartido(rutaActiva, "senador")) {
              return <Text style={styles.header}>Cámara de senadores</Text>;
            }
            if (
              rutaActiva.name === "Senadores" ||
              rutaActiva.name === "ListaSenadores" ||
              rutaActiva.name === "DescripcionSenador"
            ) {
              return (
                <Text style={styles.header}>
                  Circunscripción {user?.circunscripcion}
                </Text>
              );
            }
            return <Text style={styles.header}>Distrito {user?.distrito}</Text>;
          },
          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name="home-sharp"
              size={responsiveNavSize(16)}
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
                fontSize: responsiveNavText(12.5),
                fontFamily: FONTS.regular,
                color: COLORS.black,
                marginTop: -responsiveNavSize(3),
              },
              tabBarIconStyle: {
                width: responsiveNavSize(36),
                height: responsiveNavSize(36),
              },
              tabBarHideOnKeyboard: false,
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
                      size={responsiveNavSize(36)}
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
                      size={responsiveNavSize(36)}
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
                      size={responsiveNavSize(36)}
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
          drawerIcon: ({ focused }) => (
            <MsIcon
              icon={msFavorite}
              size={responsiveNavSize(16)}
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
              size={responsiveNavSize(16)}
              color={focused ? COLORS.greenM : COLORS.back}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: responsiveHeightScale(68),
    justifyContent: "center",
    backgroundColor: COLORS.back,
    width: "100%",
    elevation: 0,
    shadowColor: "transparent",
    borderTopWidth: 0,
  },
  item: {},

  icon: {},
  header: {
    fontFamily: FONTS.bold,
    fontSize: responsiveNavText(26),
    letterSpacing: responsiveWidthScale(2),
    color: COLORS.greenM,
    fontWeight: "bold"
  },
  buscador: {},
  modalDistritoOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalDistritoContainer: {
    width: "91%",
    backgroundColor: COLORS.back,
    borderRadius: responsiveWidthScale(22),
    overflow: "hidden",
    elevation: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: responsiveWidthScale(6),
    },
    shadowOpacity: 0.2,
    shadowRadius: responsiveWidthScale(14),
  },

  modalDistritoHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsiveWidthScale(18),
    paddingTop: responsiveWidthScale(18),
    paddingBottom: responsiveWidthScale(14),
  },

  modalDistritoIcon: {
    width: responsiveWidthScale(46),
    height: responsiveWidthScale(46),
    borderRadius: responsiveWidthScale(23),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.verdeclaro,
  },

  modalDistritoTitulos: {
    flex: 1,
    marginLeft: responsiveWidthScale(12),
    paddingRight: responsiveWidthScale(20),
  },

  modalDistritoTitulo: {
    color: COLORS.greenM,
    fontSize: responsiveNavText(17),
    lineHeight: responsiveWidthScale(23),
    fontFamily: FONTS.bold,
  },

  modalDistritoSubtitulo: {
    color: COLORS.greyM,
    fontSize: responsiveNavText(12.5),
    lineHeight: responsiveWidthScale(18),
    fontFamily: FONTS.regular,
  },

  modalDistritoCerrar: {
    position: "absolute",
    top: responsiveWidthScale(12),
    right: responsiveWidthScale(12),
    width: responsiveWidthScale(24),
    height: responsiveWidthScale(24),
    borderRadius: responsiveWidthScale(14),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.verdeclaro,
    zIndex: 10,
  },

  modalDistritoMensaje: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: responsiveWidthScale(16),
    padding: responsiveWidthScale(14),
    borderRadius: responsiveWidthScale(14),
    backgroundColor: "#F7FAF8",
    borderWidth: responsiveWidthScale(1),
    borderColor: "#E7ECE8",
  },

  modalDistritoTexto: {
    flex: 1,
    marginLeft: responsiveWidthScale(9),
    color: COLORS.black,
    fontSize: responsiveNavText(13.5),
    lineHeight: responsiveWidthScale(19),
    fontFamily: FONTS.regular,
  },

  modalDistritoBotones: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: responsiveWidthScale(16),
    paddingTop: responsiveWidthScale(16),
    paddingBottom: responsiveWidthScale(18),
    gap: responsiveWidthScale(10),
  },

  modalDistritoBoton: {
    minWidth: responsiveWidthScale(105),
    height: responsiveHeightScale(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: responsiveWidthScale(20),
    paddingHorizontal: responsiveWidthScale(15),
  },

  modalDistritoCancelar: {
    backgroundColor: COLORS.back,
    borderWidth: responsiveWidthScale(1),
    borderColor: COLORS.greenM,
  },

  modalDistritoAceptar: {
    backgroundColor: COLORS.greenM,
  },

  modalDistritoCancelarTexto: {
    color: COLORS.greenM,
    fontSize: responsiveNavText(12.5),
    fontFamily: FONTS.bold,
  },

  modalDistritoAceptarTexto: {
    color: COLORS.back,
    fontSize: responsiveNavText(12.5),
    fontFamily: FONTS.bold,
  },
});

export default MyDrawer;
