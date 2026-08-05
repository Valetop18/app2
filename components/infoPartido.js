import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { FONTS } from "../constants/fonts";

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

export const InfoPartido = ({ data, left, top, onPress }) => {
  if (!data) return null;

  const borderColor = coloresPorPartido[data.partido] || "#000";

  const TextoDinamico = () => {
    if (data.loading) {
      return data.loadingComponent;
    }

    if (data.icon) {
      return (
        <View style={styles.containerProy}>
          <MaterialIcons name={data.icon} size={14} color={data.iconColor} />
          <Text
            style={{
              color: data.iconColor,
              fontFamily: FONTS.bold,
              fontSize: 14,
            }}
          >
            {data.value}
            {data.suffix}
          </Text>
        </View>
      );
    }

    return (
      <Text style={styles.infoPorcentaje}>
        {data.value}
        {data.suffix}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 55,
        height: 55,
        backgroundColor: "rgba(255, 255, 255, 0.80)",
        borderColor,
        borderRadius: 100,
        borderWidth: 3,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        left,
        top,
      }}
    >
      <Text
        style={[
          styles.infopartido,
          {
            fontSize: (data.partido?.length ?? 0) >= 7 ? 10.2 : 12,
          },
        ]}
      >
        {data.partido}
      </Text>

      {TextoDinamico()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  infopartido: {
    fontFamily: FONTS.bold,
    fontSize: 10.2,
    color: COLORS.greenM,
    top: 5,
    lineHeight: 15,
  },
  infoPorcentaje: {
    fontFamily: FONTS.bold,
    color: COLORS.greenM,
    fontSize: 15,
  },
  containerProy: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoPorcentajeProy: {
    fontFamily: FONTS.bold,
    color: COLORS.greenM,
    fontSize: 14,
  },
});
