import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { COLORS } from "../constants/colors";
import { MsIcon } from "material-symbols-react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import {
  msPersonRaisedHand,
  msCloudUpload,
} from "@material-symbols-react-native/outlined-400";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useReacciones } from "../context/ReaccionesContext";

const coloresPorPartido = {
  DES: COLORS.DES,
  PDG: COLORS.PDG,
  IND: COLORS.IND,
  FA: COLORS.FA,
  PS: COLORS.PS,
  PC: COLORS.PC,
  PPD: COLORS.PPD,
  PL: COLORS.PL,
  PR: COLORS.PR,
  AH: COLORS.AH,
  FRVS: COLORS.FRVS,
  PDC: COLORS.PDC,
  UDI: COLORS.UDI,
  RN: COLORS.RN,
  EVOPOLI: COLORS.EVOPOLI,
  REP: COLORS.PREP,
  PNL: COLORS.PNL,
  PSC: COLORS.PSC,
  DEM: COLORS.DEM,
};

const GridRepresentPartido = ({ item }) => {
  const borderColor = coloresPorPartido[item.partido] || "#000";
  const navigation = useNavigation();
  const { reaccionesRepresentante } = useReacciones();

  const onSelected = () => {
    navigation.navigate("Descripcion", {
      idDiputado: item.id,
      from: "EstadisticaPartido",
    });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={onSelected}
        activeOpacity={0.85}
        style={styles.container}
      >
        {/* Fotografía y partido */}
        <View style={styles.containImage}>
          <Image
            style={[
              styles.foto,
              {
                borderColor,
              },
            ]}
            source={{ uri: item.foto }}
          />
          <Text style={styles.partido}>{item.partido}</Text>
        </View>

        {/* Información del diputado */}
        <View style={styles.infoEscrita}>
          {/* Nombre y representación distrital */}
          <View style={styles.headerCard}>
            <Text style={styles.name} numberOfLines={1}>
              {item.nombre}
            </Text>

            <View style={styles.dataUsage}>
              <MaterialIcons
                name="data-usage"
                size={39}
                color={COLORS.verdeclaro}
                style={styles.dataUsageIcon}
              />

              <Text style={styles.data2}>
                {item.representacionDistrital ?? 0}%
              </Text>
            </View>
          </View>

          {/* Dos columnas de estadísticas */}
          <View style={styles.containerInfo}>
            {/* Columna izquierda */}
            <View style={styles.columnaInfo}>
              <View style={styles.filaEstadistica}>
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name="event-available"
                    size={20}
                    color={COLORS.greenM}
                  />
                </View>

                <View style={styles.textoEstadistica}>
                  <Text style={styles.valorEstadistica}>
                    {item.asistencia ?? 0}%
                  </Text>

                  <Text style={styles.nombreEstadistica}>Asistencia</Text>
                </View>
              </View>

              <View style={styles.filaEstadistica}>
                <View style={styles.iconContainer}>
                  <MsIcon
                    icon={msPersonRaisedHand}
                    size={20}
                    color={COLORS.greenM}
                  />
                </View>

                <View style={styles.textoEstadistica}>
                  <Text style={styles.valorEstadistica}>
                    {item.participacionVotaciones ?? 0}%
                  </Text>

                  <Text style={styles.nombreEstadistica}>Votaciones</Text>
                </View>
              </View>
            </View>

            {/* Columna derecha */}
            <View style={styles.columnaInfoDerecha}>
              <View style={styles.filaEstadistica}>
                <View style={styles.iconContainer}>
                  <FontAwesome
                    name="handshake-o"
                    size={19}
                    color={COLORS.greenM}
                  />
                </View>

                <View style={styles.textoEstadistica}>
                  <Text style={styles.valorEstadistica}>
                    {item.adherenciaPartido ?? 0}%{" "}
                    <Text style={styles.nombreEstadistica}>Alineación</Text>
                  </Text>

                  <Text style={styles.nombreEstadistica}>al partido</Text>
                </View>
              </View>

              <View style={styles.filaEstadistica}>
                <View style={styles.iconContainer}>
                  <MsIcon
                    icon={msCloudUpload}
                    size={20}
                    color={COLORS.greenM}
                  />
                </View>

                <View style={styles.textoEstadistica}>
                  <Text style={styles.valorEstadistica}>
                    {item.fraccionMociones ?? "0/0"}
                    <Text style={styles.nombreEstadistica}> Mociones</Text>
                  </Text>

                  <Text style={styles.nombreEstadistica}>Aprob./Pres.</Text>
                </View>
              </View>
            </View>
            <View style={styles.likesContainer}>
              <Text style={styles.likesText} numberOfLines={1}>
                {item.totalLikes ?? 0}
              </Text>

              <Ionicons
                name={
                  reaccionesRepresentante[item.id] === "like"
                    ? "heart-circle"
                    : "heart-circle-outline"
                }
                size={26}
                color={
                  reaccionesRepresentante[item.id] === "like"
                    ? COLORS.greenM
                    : COLORS.gray
                }
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: COLORS.back,
  },

  container: {
    width: "96%",
    minHeight: 125,
    marginVertical: "1.2%",
    paddingVertical: 3,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.back,
    borderRadius: 12,

    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  containImage: {
    width: 82,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  partido: {
    marginTop: 8,
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.black,
    textAlign: "center",
  },
  foto: {
    width: 72,
    height: 72,
    borderRadius: 50,
    borderWidth: 3,
  },
  infoEscrita: {
    flex: 1,
    marginLeft: 4,
    marginTop: -2,
  },

  headerCard: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  name: {
    flex: 1,
    marginLeft: 5,
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 18,
    lineHeight: 22,
    color: COLORS.black,
    marginTop: 10,
  },

  dataUsage: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginRight: 10,
  },

  dataUsageIcon: {
    position: "absolute",
  },

  data2: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 12,
    color: COLORS.greenM,
  },

  containerInfo: {
    width: "100%",
    flexDirection: "row",
    marginTop: 1,
    paddingRight: 56,
    position: "relative",
  },

  columnaInfo: {
    width: "46%",
  },

  columnaInfoDerecha: {
    width: "54%",
  },
  filaEstadistica: {
    minHeight: 39,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1,
  },

  iconContainer: {
    width: 27,
    alignItems: "center",
    justifyContent: "center",
  },

  textoEstadistica: {
    flex: 1,
    marginLeft: 3,
    justifyContent: "center",
  },

  valorEstadistica: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 13.5,
    lineHeight: 16,
    color: COLORS.black,
  },

  nombreEstadistica: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12.5,
    lineHeight: 15,
    color: COLORS.black,
  },
  likesContainer: {
    position: "absolute",
    right: 5,
    top: 0,
    bottom: 0,
    width: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  likesText: {
    minWidth: 20,
    marginRight: 2,
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 12.5,
    lineHeight: 16,
    color: COLORS.black,
    textAlign: "right",
    paddingTop: 2,
  },
});

export default GridRepresentPartido;
