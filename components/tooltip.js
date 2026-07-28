import React, { useRef } from "react";
import { View, Pressable, StyleSheet, useWindowDimensions } from "react-native";

import { useTooltip } from "../context/TooltipProvider";

export const TOOLTIPS = {
  asistencia: {
    especifica:
      "Porcentaje de asistencia a esta sesión. Las ausencias no consideran justificaciones, ya que su motivo se encuentra disponible en el detalle.",
    acumulada:
      "Porcentaje de asistencia del período considerando las ausencias justificadas, como licencias médicas o permisos oficiales.",
  },

  votaciones: {
    especifica:
      "Porcentaje de votaciones en las que se emitió un voto (A favor, En contra o Abstención), excluyendo pareos (acuerdos para no votar) y no votos.",
    acumulada:
      "Porcentaje de votaciones del período en las que emitió un voto (A favor, En contra o Abstención), excluyendo pareos (acuerdos para no votar) y no votos.",
  },

  atrasos:
    "Porcentaje de sesiones en las que el parlamentario llegó con más de 3 minutos de retraso.",
  oficios:
    "Cantidad de oficios enviados por el parlamentario para solicitar información o realizar requerimientos.",
  mociones: {
    especifica:
      "Cantidad de proyectos de ley presentados por el parlamentario.",
    acumulada: "Cantidad de proyectos de ley presentados por los partidos.",
  },
  representaciondistrital: {
    legislador:
      "Porcentaje de votaciones en las que el parlamentario coincidió con los usuarios de su distrito.",
    partido:
      "Promedio del porcentaje de representación distrital de los parlamentarios del partido.",
  },
  proyectosAprobadosPresentados:
    "Cantidad de proyectos del parlamentario aprobados en la Cámara, respecto del total de proyectos presentados.",
  adherenciaPartido:
    "Porcentaje de votaciones en las que el parlamentario votó igual que la mayoría de su partido. No considera los pareos ni las votaciones en las que el partido estuvo dividido.",
  compatibilidadUsuarioLegislador:
    "Porcentaje de votaciones en las que tu opinión coincidió con el voto del parlamentario. Un «Me gusta» coincide con un voto a favor y un «No me gusta» con un voto en contra.",
  lugarEstadisticoLegislador:
    "Lugar que ocupa el parlamentario entre todos los representantes según un puntaje estadístico que considera asistencia, participación en votaciones, proyectos aprobados y presentados, oficios enviados y atrasos.",
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
  const containerRef = useRef(null);

  const { width: screenWidth } = useWindowDimensions();

  const { openTooltip, providerRef } = useTooltip();

  const handlePress = () => {
    if (!containerRef.current || !providerRef.current) {
      return;
    }

    containerRef.current.measureLayout(
      providerRef.current,
      (x, y, triggerWidth, triggerHeight) => {
        const margenPantalla = 12;

        let nuevoOffsetX = 0;

        const bordeIzquierdoTooltip = x;
        const bordeDerechoTooltip = x + width;

        if (bordeIzquierdoTooltip < margenPantalla) {
          nuevoOffsetX = margenPantalla - bordeIzquierdoTooltip;
        } else if (bordeDerechoTooltip > screenWidth - margenPantalla) {
          nuevoOffsetX = screenWidth - margenPantalla - bordeDerechoTooltip;
        }

        openTooltip(id, {
          text,
          width,
          left: x + nuevoOffsetX,
          top: y + triggerHeight + 4,
          arrowOffsetX: -nuevoOffsetX,
          tooltipStyle,
          textStyle,
        });
      },
      () => {
        // No se abre si no se puede medir.
      },
    );
  };

  if (disabled) {
    return children;
  }

  return (
    <View ref={containerRef} collapsable={false} style={styles.container}>
      <Pressable onPress={handlePress}>{children}</Pressable>
    </View>
  );
};

export default Tooltip;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    overflow: "visible",
  },
});
