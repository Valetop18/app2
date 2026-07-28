import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { COLORS } from "../constants/colors";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useState, useEffect } from "react";
import { msPersonRaisedHand } from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import { responsiveSize, responsiveFont, responsiveIcon } from "../utils/responsive";

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
              width: responsiveSize(76),
              height: responsiveSize(76),
              borderRadius: responsiveSize(100),
              borderWidth: responsiveSize(3),
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
              {item.totalLikes > 0 ? item.totalLikes : ""}
            </Text>
            <TouchableOpacity
              style={styles.icono}
              marginTop={"-1%"}
              onPress={() => handleLike(item.id, "like")}
            >
              <Ionicons
                name="heart-circle-outline"
                size={responsiveIcon(26)}
                color={reaccion === "like" ? COLORS.greenM : COLORS.grey}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.containerInfo}>
            <View>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons
                  name="event-available"
                  size={responsiveIcon(17)}
                  color={COLORS.greenM}
                />
                <Text style={styles.informacion}>
                  {item.asistencia ?? 0}% Asistencia{" "}
                </Text>
              </View>
              <View
                flexDirection={"row"}
                alignItems={"center"}
                marginTop={"2.5%"}
              >
                <MsIcon
                  icon={msPersonRaisedHand}
                  size={responsiveIcon(18)}
                  color={COLORS.greenM}
                />
                <Text style={styles.informacion}>
                  {item.votaciones ?? 0}% Votaciones{" "}
                </Text>
              </View>
            </View>
            <View style={styles.info}>
              <View>
                <View flexDirection={"row"} alignItems={"center"}>
                  <MaterialIcons
                    name="assignment-late"
                    size={responsiveIcon(18)}
                    color={COLORS.greenM}
                  />
                  <Text style={styles.informacion} marginLeft={"1%"}>
                    {item.oficios ?? 0} oficios
                  </Text>
                </View>
                <View
                  flexDirection={"row"}
                  alignItems={"center"}
                  marginTop={"2.5%"}
                >
                  <MaterialIcons
                    name="addchart"
                    size={responsiveIcon(17)}
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
                size={responsiveIcon(40)}
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
    borderRadius: 10,
    width: "96%",
    backgroundColor: COLORS.back,
    elevation: 3,
    shadowColor: COLORS.black,
  },
  containImage: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "1.8%",
    marginTop: "4.5%",
  },
  infoEscrita: {
    marginVertical: "2.5%",
    width: "74%",
  },
  info: {
    marginLeft: "6.5%",
  },
  name: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(20),
    marginLeft: "1%",
    flex: 1,
    maxWidth: "87%",
    color: COLORS.black,
    marginTop: "-1.5%",
  },
  totLikes: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(12),
    color: COLORS.greyM,
    right: "-2%",
  },
  icono: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "4%",
  },
  porcentaje: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 12,
  },
  partido: {
    fontFamily: "NotoSansMyanmar_700Bold",
    justifyContent: "center",
    alignItems: "center",
    color: COLORS.black,
    fontSize: responsiveFont(14),
    marginTop: "2%",
  },
  parametros: {
    fontFamily: "NotoSansMyanmar_400Regular",
  },
  informacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: responsiveFont(14),
    color: COLORS.black,
    marginLeft: 5,
  },
  informacionProyectos: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,
    marginLeft: "2%",
  },
  containerInfo: {
    marginVertical: "2%",
    marginHorizontal: "3%",
    flexDirection: "row",
    marginLeft: "3%",
  },
  dataUsage: {
    alignItems: "center",
    width: responsiveSize(42),
    height: responsiveSize(42),
    justifyContent: "center",
    right: -12,
    marginTop: 5,
  },
  data2: {
    fontSize: responsiveFont(12),
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
  },
});

export default GridRepresent;
