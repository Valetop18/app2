import React, { useRef } from "react";
import { View, Pressable, StyleSheet, useWindowDimensions } from "react-native";

import { useTooltip } from "../context/TooltipProvider";

export const TOOLTIPS = {
  asistencia: {
    especifica:
      "Porcentaje de asistencia a esta sesión. Las ausencias no consideran justificaciones, ya que su motivo se encuentra disponible en el detalle.",
    acumulada:
      "Porcentaje de asistencia del período considerando las ausencias justificadas, como licencias médicas o permisos oficiales.",
    partido:
      "Porcentaje de asistencia de las(os) legisladoras(es) del partido a las sesiones, considerando las justificaciones registradas.",
  },

  votaciones: {
    especifica:
      "Porcentaje de votaciones en las que se emitió un voto (A favor, En contra o Abstención), excluyendo pareos (acuerdos para no votar) y no votos.",
    acumulada:
      "Porcentaje de votaciones del período en las que emitió un voto (A favor, En contra o Abstención), excluyendo pareos (acuerdos para no votar) y no votos.",
    partido:
      "Porcentaje de votaciones del período en las que las(os) legisladoras(es) del partido emitieron un voto (A favor, En contra o Abstención), excluyendo pareos (acuerdos para no votar) y no votos.",
  },

  atrasos:
    "Porcentaje de sesiones en las que el parlamentario llegó con más de 3 minutos de retraso.",
  oficios:
    "Cantidad de oficios enviados por el parlamentario para solicitar información o realizar requerimientos.",
  mociones: {
    especifica:
      "Cantidad de proyectos de ley presentados por el parlamentario.",
    acumulada: "Cantidad de proyectos de ley presentados por los partidos.",
    partido:
      "Cantidad de proyectos de ley presentados por los parlamentarios del partido.",
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
  cohesionPartido:
    "En cada votación se identifica cuál fue la postura más adoptada por los legisladores del partido y se calcula qué porcentaje la siguió. El resultado corresponde al promedio de todas las votaciones del período.",
  oficiosPartido:
    "Cantidad de oficios enviados por los parlamentarios del partido para solicitar información o realizar requerimientos.",
  CompatibilidadPartidoUsuario:
    "Compara tus preferencias con la forma en que votó mayoritariamente el partido. Mientras más coincidan, mayor será tu porcentaje de compatibilidad.",
  rankingPartidos:
    "Ubica al partido entre los 18 partidos con representación en la Cámara. La posición se calcula considerando su asistencia, participación en votaciones, cohesión, representación distrital, mociones aprobadas y presentadas, oficios y cantidad de diputados(as).",
  reaccionFueraDistrito:
    "Solo puedes dar «Me gusta» en representantes que pertenezcan a tu distrito.",
};

const Tooltip = ({
  children,
  text,
  width = 220,
  disabled = false,
  tooltipStyle,
  textStyle,
  arrowStyle,
  hitSlop,
}) => {
  const id = useRef(Symbol()).current;
  const containerRef = useRef(null);

  const { width: screenWidth } = useWindowDimensions();

  const { openTooltip, providerRef } = useTooltip();

  const handlePress = () => {
    if (!containerRef.current || !providerRef.current) {
      return;
    }

    providerRef.current.measureInWindow(
      (providerX, providerY, providerWidth) => {
        containerRef.current.measureInWindow(
          (triggerX, triggerY, triggerWidth, triggerHeight) => {
            const margenPantalla = 12;

            // Posición relativa al TooltipProvider
            const x = triggerX - providerX;
            const y = triggerY - providerY;

            // Centrar el tooltip respecto al texto presionado
            let left = x + triggerWidth / 2 - width / 2;

            // Evitar que se salga del TooltipProvider
            if (left < margenPantalla) {
              left = margenPantalla;
            } else if (left + width > providerWidth - margenPantalla) {
              left = providerWidth - margenPantalla - width;
            }

            // Mantener la flecha apuntando al centro del texto
            const arrowOffsetX = x + triggerWidth / 2 - left - width * 0.1;

            openTooltip(id, {
              text,
              width,
              left,
              top: y + triggerHeight + 4,
              arrowOffsetX,
              tooltipStyle,
              textStyle,
              arrowStyle,
            });
          },
        );
      },
    );
  };

  if (disabled) {
    return children;
  }

  return (
    <View ref={containerRef} collapsable={false} style={styles.container}>
      <Pressable onPress={handlePress} hitSlop={hitSlop}>
        {children}
      </Pressable>
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
