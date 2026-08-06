import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
  msFlaky,
  msJoinRight,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import { COLORS } from "../constants/colors";
import { responsiveWidthScale } from "../utils/responsive";

const TooltipVotaciones = ({ voto }) => {
  const v = voto?.toLowerCase() ?? "";

  let icono;
  let texto;

  if (v.includes("favor")) {
    icono = (
      <MaterialIcons
        name="check-circle"
        size={responsiveWidthScale(18)}
        color={COLORS.greenM}
      />
    );
    texto = "A favor";
  } else if (v.includes("contra")) {
    icono = (
      <MaterialIcons
        name="cancel"
        size={responsiveWidthScale(18)}
        color={COLORS.FA}
      />
    );
    texto = "En contra";
  } else if (v.includes("absten")) {
    icono = (
      <MsIcon
        icon={msFlaky}
        size={responsiveWidthScale(18)}
        color={COLORS.UDI}
      />
    );
    texto = "Abstención";
  } else if (v.includes("pareo")) {
    icono = (
      <MsIcon
        icon={msJoinRight}
        size={responsiveWidthScale(19)}
        color={COLORS.PDG}
      />
    );
    texto = "Pareo";
  } else {
    icono = (
      <Ionicons
        name="remove-circle"
        size={responsiveWidthScale(18)}
        color={COLORS.greyM}
      />
    );
    texto = "No voto";
  }

  const esFavor = v.includes("favor");

  return (
    <View style={styles.row}>
      {icono}

      <Text
        style={[
          styles.text,
          esFavor && styles.textFavor,
        ]}
      >
        {texto}
      </Text>
    </View>
  );
};

export default TooltipVotaciones;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  text: {
    color: COLORS.back,
    fontSize: 13,
    marginLeft: 6,
  },

  textFavor: {
    color: COLORS.greenM,
  },
});