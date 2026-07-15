import React, { useState, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import { useTooltip } from "../context/TooltipProvider";

export const TOOLTIPS = {
  asistencia: {
    especifica: "Porcentaja de asistencia sin justificaciones, el motivo está en el detalle.",
    acumulada: "Porcentaje de asistencia con ausencias justificadas incluidas.",
  },
  votaciones: {
    definicion: "Porcentaje de votaciones efectivas, descontando pareos y no votos.",
    especifica: "Porcentaje de votos efectivos en la sesión, descontando pareos y no votos.",
    acumulada: "Porcentaje de votaciones efectivas en este período, descontando pareos y no votos.",
  },
  atrasos: "Porcentaje de atrasos a cada sesión.",
  mociones: {

  },

};

const Tooltip = ({
  children,
  text,
  width = 220,
  disabled = false,
  tooltipStyle,
  textStyle,
}) => {
  const id = useRef(Symbol()).current;

const {
    activeTooltip,
    openTooltip,
} = useTooltip();

const visible = activeTooltip === id;

  if (disabled) {
    return children;
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => openTooltip(id)}
      >
        {children}
      </Pressable>

      {visible && (
        <View style={[styles.tooltip, { width }, tooltipStyle]}>
          <View style={styles.arrow} />
          
          <Text style={[styles.text, textStyle]}>{text}</Text>
          
        </View>
      )}
    </View>
  );
};

export default Tooltip;


const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
  },

  tooltip: {
    position: "absolute",
    top: 30,
    backgroundColor: COLORS.greenM,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    zIndex: 999,
    elevation: 10,
  },

  text: {
    color: COLORS.back,
    fontSize: 13,
    textAlign: "left",
  },

  arrow: {
  position: "absolute",
  top: -5,
  left: "10%",
  width: 12,
  height: 12,
  backgroundColor: COLORS.greenM,
  transform: [
    { translateX: -6 },
    { rotate: "45deg" },
  ],
},
});
