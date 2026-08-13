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
import { FONTS } from "../constants/fonts";
import { responsiveWidthScale } from "../utils/responsive";
import { useData } from "../context/DataContext";

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
      diputadoInicial: item,
      from: "EstadisticaPartido",
    });
  };

  const { totalesLikesRepresentantes } = useData();

  const totalLikesVisible =
    totalesLikesRepresentantes[item.id] ??
    item.totalLikes ??
    0;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={onSelected}
        activeOpacity={0.85}
        style={styles.container}
      >
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
        <View style={styles.infoEscrita}>
          <View style={styles.headerCard}>
            <Text style={styles.name} numberOfLines={1}>
              {item.nombre}
            </Text>

            <View style={styles.dataUsage}>
              <MaterialIcons
                name="data-usage"
                size={responsiveWidthScale(39)}
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
                    size={responsiveWidthScale(20)}
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
                    size={responsiveWidthScale(20)}
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
                    size={responsiveWidthScale(19)}
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
                    size={responsiveWidthScale(20)}
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
                {totalLikesVisible}
              </Text>

              <Ionicons
                name={
                  reaccionesRepresentante[item.id] === "like"
                    ? "heart-circle"
                    : "heart-circle-outline"
                }
                size={responsiveWidthScale(26)}
                color={
                  reaccionesRepresentante[item.id] === "like"
                    ? COLORS.greenM
                    : COLORS.greyM
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
    minHeight: responsiveWidthScale(125),
    marginVertical: "1.2%",
    paddingVertical: responsiveWidthScale(3),
    paddingHorizontal: responsiveWidthScale(5),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.back,
    borderRadius: responsiveWidthScale(12),

    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: responsiveWidthScale(2),
    },
    shadowOpacity: 0.12,
    shadowRadius: responsiveWidthScale(4),
  },

  containImage: {
    width: responsiveWidthScale(82),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },

  partido: {
    marginTop: responsiveWidthScale(8),
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(14)),
    lineHeight: responsiveWidthScale(18),
    color: COLORS.black,
    textAlign: "center",
  },

  foto: {
    width: responsiveWidthScale(72),
    height: responsiveWidthScale(72),
    borderRadius: responsiveWidthScale(50),
    borderWidth: responsiveWidthScale(3),
  },

  infoEscrita: {
    flex: 1,
    marginLeft: responsiveWidthScale(4),
    marginTop: responsiveWidthScale(-4),
  },

  headerCard: {
    minHeight: responsiveWidthScale(34),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  name: {
    flex: 1,
    marginLeft: responsiveWidthScale(5),
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(18)),
    lineHeight: responsiveWidthScale(22),
    color: COLORS.black,
    marginTop: responsiveWidthScale(4),
  },

  dataUsage: {
    width: responsiveWidthScale(38),
    height: responsiveWidthScale(38),
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsiveWidthScale(5),
    marginRight: responsiveWidthScale(10),
  },

  dataUsageIcon: {
    position: "absolute",
  },

  data2: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(12)),
    color: COLORS.greenM,
    top: responsiveWidthScale(-1.5)
  },

  containerInfo: {
    width: "100%",
    flexDirection: "row",
    marginTop: responsiveWidthScale(1),
    paddingRight: responsiveWidthScale(56),
    position: "relative",
  },

  columnaInfo: {
    width: "46%",
  },

  columnaInfoDerecha: {
    width: "54%",
  },

  filaEstadistica: {
    minHeight: responsiveWidthScale(39),
    flexDirection: "row",
    alignItems: "center",
    marginVertical: responsiveWidthScale(1),
  },

  iconContainer: {
    width: responsiveWidthScale(27),
    alignItems: "center",
    justifyContent: "center",
  },

  textoEstadistica: {
    flex: 1,
    marginLeft: responsiveWidthScale(3),
    justifyContent: "center",
  },

  valorEstadistica: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(13.5)),
    lineHeight: responsiveWidthScale(16),
    color: COLORS.black,
  },

  nombreEstadistica: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(12.5)),
    lineHeight: responsiveWidthScale(15),
    color: COLORS.black,
  },

  likesContainer: {
    position: "absolute",
    right: responsiveWidthScale(5),
    top: 0,
    bottom: 0,
    width: responsiveWidthScale(56),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  likesText: {
    minWidth: responsiveWidthScale(20),
    marginRight: responsiveWidthScale(2),
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(12.5)),
    lineHeight: responsiveWidthScale(16),
    color: COLORS.black,
    textAlign: "right",
    paddingTop: responsiveWidthScale(2),
  },
});

export default GridRepresentPartido;
