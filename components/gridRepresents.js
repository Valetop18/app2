import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useState, useEffect } from "react";
import { msPersonRaisedHand } from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
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

const GridRepresent = ({ item, reaccion, onSelected, handleLike }) => {
  //const isLiked = item
  const borderColor = coloresPorPartido[item.partido] || "#000";

  const { totalesLikesRepresentantes } = useData();

  const totalLikesVisible =
    totalesLikesRepresentantes[item.id] ??
    item.totalLikes ??
    0;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => onSelected(item)}
        style={{ ...styles.container }}
      >
        <View style={styles.containImage}>
          <Image
            style={{
              borderColor,
              width: responsiveWidthScale(76),
              height: responsiveWidthScale(76),
              borderRadius: responsiveWidthScale(100),
              borderWidth: responsiveWidthScale(3),
            }}
            source={{ uri: item.foto }}
          />
          <Text style={styles.partido}>
            {item.partido}
            {item.estado && <Text> - {item.estado}</Text>}
          </Text>
        </View>
        <View style={styles.infoEscrita}>
          <View flexDirection={"row"} alignItems={"center"}>
            <Text
              style={styles.name}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {item.nombre}
            </Text>
            <Text style={styles.totLikes}>
              {totalLikesVisible > 0 ? totalLikesVisible : ""}
            </Text>
            <TouchableOpacity
              style={styles.icono}
              marginTop={"-1%"}
              onPress={() => handleLike(item.id, "like")}
            >
              <Ionicons
                name="heart-circle-outline"
                size={responsiveWidthScale(26)}
                color={reaccion === "like" ? COLORS.greenM : COLORS.grey}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.containerInfo}>
            <View>
              <View
                flexDirection={"row"}
                alignItems={"center"}
                marginVertical={responsiveWidthScale(6)}
              >
                <MaterialIcons
                  name="event-available"
                  size={responsiveWidthScale(17)}
                  color={COLORS.greenM}
                />
                <Text style={styles.informacion}>
                  {item.asistencia ?? 0}% Asistencia{" "}
                </Text>
              </View>
              <View flexDirection={"row"} alignItems={"center"} marginTop={responsiveWidthScale(3)}>
                <MsIcon
                  icon={msPersonRaisedHand}
                  size={responsiveWidthScale(17)}
                  color={COLORS.greenM}
                />
                <Text style={styles.informacion}>
                  {item.votaciones ?? 0}% Votaciones{" "}
                </Text>
              </View>
            </View>
            <View style={styles.info}>
              <View>
                <View
                  flexDirection={"row"}
                  alignItems={"center"}
                  marginVertical={responsiveWidthScale(6)}
                >
                  <MaterialIcons
                    name="assignment-late"
                    size={responsiveWidthScale(17)}
                    color={COLORS.greenM}
                  />
                  <Text style={styles.informacion} marginLeft={"1%"}>
                    {item.oficios ?? 0} oficios
                  </Text>
                </View>
                <View flexDirection={"row"} alignItems={"center"} marginTop={responsiveWidthScale(3)}>
                  <MaterialIcons
                    name="addchart"
                    size={responsiveWidthScale(17)}
                    color={COLORS.greenM}
                  />
                  <Text style={styles.informacion}>
                    {item.mociones ?? 0} mociones{" "}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.dataUsage}>
              <MaterialIcons
                name="data-usage"
                size={responsiveWidthScale(40)}
                color={COLORS.verdeclaro}
                position={"absolute"}
              />
              <Text style={styles.data2}>
                {item.representacionDistrital ?? 0}%
              </Text>
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
    marginVertical: "1%",
    display: "flex",
    alignContent: "center",
    flexDirection: "row",
    borderRadius: responsiveWidthScale(10),
    width: "96%",
    backgroundColor: COLORS.back,

    // Android
    elevation: 3,

    // iOS
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: responsiveWidthScale(2),
    },
    shadowOpacity: 0.12,
    shadowRadius: responsiveWidthScale(4),
  },

  containImage: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "1.8%",
    marginTop: "3.5%",
  },

  infoEscrita: {
    marginVertical: "2.5%",
    width: "74%",
  },

  info: {
    marginLeft: "5%",
    transform: [
      {
        translateY: responsiveWidthScale(1),
      },
    ],
  },

  name: {
    fontFamily: FONTS.bold,
    fontSize: responsiveWidthScale(20),
    marginLeft: "1%",
    flex: 1,
    maxWidth: "87%",
    color: COLORS.black,
    marginTop: "-1.5%",
  },

  totLikes: {
    fontFamily: FONTS.bold,
    fontSize: responsiveWidthScale(12),
    color: COLORS.greyM,
    right: "-2%",
    top: responsiveWidthScale(-1.5),
  },

  icono: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "4%",
  },

  porcentaje: {
    fontFamily: FONTS.bold,
    fontSize: responsiveWidthScale(12),
  },

  partido: {
    fontFamily: FONTS.bold,
    justifyContent: "center",
    alignItems: "center",
    color: COLORS.black,
    fontSize: responsiveWidthScale(14),
    marginVertical: "4%",
  },

  parametros: {
    fontFamily: FONTS.regular,
  },

  informacion: {
    fontFamily: FONTS.regular,
    fontSize: responsiveWidthScale(14),
    color: COLORS.black,
    marginLeft: responsiveWidthScale(5),
  },

  informacionProyectos: {
    fontFamily: FONTS.regular,
    fontSize: responsiveWidthScale(14),
    color: COLORS.black,
    marginLeft: "2%",
  },

  containerInfo: {
    marginVertical: "2.5%",
    marginHorizontal: "3%",
    flexDirection: "row",
    marginLeft: "3%",
  },

  dataUsage: {
    alignItems: "center",
    width: responsiveWidthScale(42),
    height: responsiveWidthScale(42),
    justifyContent: "center",
    right: responsiveWidthScale(-12),
    marginTop: responsiveWidthScale(5),
  },

  data2: {
    fontSize: responsiveWidthScale(12),
    fontFamily: FONTS.bold,
    color: COLORS.greenM,
    top: responsiveWidthScale(-1),
  },
});

export default GridRepresent;