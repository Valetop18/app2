import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { COLORS } from "../constants/colors";
import { useState, useEffect } from "react";
import { db } from "../constants/config";
import { msPersonRaisedHand } from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import { useNavigation } from "@react-navigation/native";

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

  const onSelected = () => {
    navigation.navigate("Descripcion", {
      idDiputado: item.id,
      from: "EstadistaPartidoDiputad",
    });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onSelected} style={{ ...styles.container }}>
        <View style={styles.containImage}>
          <Image
            style={{
              borderColor,
              width: 72,
              height: 72,
              borderRadius: 100,
              borderWidth: 3,
            }}
            source={{ uri: item.foto }}
          />
          <Text style={styles.partido}>{item.partido}</Text>
        </View>
        <View style={styles.infoEscrita}>
          <View flexDirection={"row"} alignItems={"center"}>
            <Text style={styles.name}>{item.nombre}</Text>
            <View style={styles.icono} marginTop={"-1%"}>
              <View style={styles.dataUsage}>
                <MaterialIcons
                  name="data-usage"
                  size={40}
                  color={COLORS.verdeclaro}
                  position={"absolute"}
                />
                <Text style={styles.data2}>
                  {item.representacionDistrital ?? 0}%
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.containerInfo}>
            <View>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons
                  name="event-available"
                  size={17}
                  color={COLORS.greenM}
                />
                <Text style={styles.informacion}>
                  {item.asistencia ?? 0}% Asistencia
                </Text>
              </View>
              <View
                flexDirection={"row"}
                alignItems={"center"}
                marginTop={"14%"}
              >
                <MsIcon
                  icon={msPersonRaisedHand}
                  size={18}
                  color={COLORS.greenM}
                />
                <Text style={styles.informacion}>
                  {item.participacionVotaciones ?? 0}% Votaciones
                </Text>
              </View>
            </View>
            <View style={styles.info}>
              <View>
                <View flexDirection={"row"} alignItems={"center"}>
                  <MaterialIcons
                    name="diversity-2"
                    size={17}
                    color={COLORS.greenM}
                  />
                  <Text
                    style={styles.informacion}
                    marginLeft={"1%"}
                    maxWidth={120}
                  >
                    {item.adherenciaPartido ?? 0}% adherencia al partido
                  </Text>
                </View>
                <View
                  flexDirection={"row"}
                  alignItems={"center"}
                  marginTop={"2.5%"}
                >
                  <MaterialIcons
                    name="assignment-turned-in"
                    size={17}
                    color={COLORS.greenM}
                  />
                  <Text style={styles.informacion}>
                    {item.fraccionMociones ?? "0/0"} mociones
                  </Text>
                </View>
              </View>
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
    marginHorizontal: "1.5%",
    marginTop: "4.5%",
  },
  infoEscrita: {
    marginVertical: "2.5%",
    width: "74%",
  },
  info: {
    marginLeft: "5%",
  },
  name: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 18,
    marginLeft: "1%",
    flex: 1,
    maxWidth: "87%",
    color: COLORS.black,
    marginTop: "-1.5%",
  },
  icono: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
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
    fontSize: 14,
    marginTop: "2%",
  },
  parametros: {
    fontFamily: "NotoSansMyanmar_400Regular",
  },
  informacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,
    marginLeft: "2%",
    lineHeight: 16,
    paddingVertical: 5,
    paddingLeft: 4,
  },
  informacionProyectos: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,
    marginLeft: "2%",
  },
  containerInfo: {
    marginVertical: "1%",
    marginHorizontal: "2%",
    flexDirection: "row",
    marginLeft: "0.5%",
    backgroundColor: 'pink'
  },
  dataUsage: {
    alignItems: "center",
    width: 42,
    height: 42,
    justifyContent: "center",
  },
  data2: {
    fontSize: 12,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
  },
});

export default GridRepresentPartido;
