import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { useTooltip } from "../context/TooltipProvider";

export const TOOLTIPS = {
  asistencia: {
    especifica:
      "Porcentaje de asistencia a esta sesión. Las ausencias no consideran justificaciones, ya que su motivo se encuentra disponible en el detalle.",
    especificaSenado:
      "Porcentaje de asistencia a esta sesión, sin considerar justificaciones ni licencias.",
    acumulada:
      "Porcentaje de asistencia del período considerando las ausencias justificadas, como licencias médicas o permisos oficiales.",
    partido:
      "Porcentaje de asistencia de las(os) diputados(as) del partido a las sesiones, considerando las justificaciones registradas.",
    partidoSenado:
      "Porcentaje de asistencia de las(os) senadoras(es) del partido a las sesiones, considerando las justificaciones registradas.",
  },

  votaciones: {
    especifica:
      "Porcentaje de votaciones en las que se emitió un voto (A favor, En contra o Abstención), excluyendo pareos (acuerdos para no votar) y no votos.",
    acumulada:
      "Porcentaje de votaciones del período en las que emitió un voto (A favor, En contra o Abstención), excluyendo pareos (acuerdos para no votar) y no votos.",
    partido:
      "Porcentaje de votaciones del período en las que las(os) diputadas(es) del partido emitieron un voto (A favor, En contra o Abstención), excluyendo pareos (acuerdos para no votar) y no votos.",
    partidoSenado:
      "Porcentaje de votaciones del período en las que las(os) senadoras(es) del partido emitieron un voto (A favor, En contra o Abstención), excluyendo pareos (acuerdos para no votar) y no votos.",
  },

  atrasos:
    "Porcentaje de sesiones en las que el parlamentario llegó con más de 3 minutos de retraso.",
  acuerdos:
    "Cantidad de proyectos de acuerdo presentados por el senador para expresar una opinión o solicitar medidas a una autoridad pública sobre materias de interés general.",
  oficios:
    "Cantidad de oficios enviados por el parlamentario para solicitar información o realizar requerimientos.",
  mociones: {
    especifica:
      "Cantidad de proyectos de ley presentados por el parlamentario.",
    acumulada: "Cantidad de proyectos de ley presentados por los partidos.",
    partido:
      "Cantidad de proyectos de ley presentados por los diputados del partido.",
    partidoSenado:
      "Cantidad de proyectos de ley presentados por los senadores del partido.",
  },
  representaciondistrital: {
    legislador:
      "Porcentaje de votaciones en las que el parlamentario coincidió con los usuarios de su distrito.",
    partido:
      "Promedio del porcentaje de representación distrital de los diputados del partido.",
    partidoSenado:
      "Promedio del porcentaje de representación distrital de los senadores del partido.",
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
    "En cada votación se identifica cuál fue la postura más adoptada por los diputados del partido y se calcula qué porcentaje la siguió. El resultado corresponde al promedio de todas las votaciones del período.",
  cohesionPartidoSenado:
    "En cada votación se identifica cuál fue la postura más adoptada por los senadores del partido y se calcula qué porcentaje la siguió. El resultado corresponde al promedio de todas las votaciones del período.",
  oficiosPartido:
    "Cantidad de oficios enviados por los diputados del partido para solicitar información o realizar requerimientos.",
  oficiosPartidoSenado:
    "Cantidad de oficios enviados por los senadores del partido para solicitar información o realizar requerimientos.",
  CompatibilidadPartidoUsuario:
    "Compara tus preferencias con la forma en que votó mayoritariamente el partido en la cámara de diputados. Mientras más coincidan, mayor será tu porcentaje de compatibilidad.",
  CompatibilidadPartidoUsuarioSenado:
    "Compara tus preferencias con la forma en que votó mayoritariamente el partido en el senado. Mientras más coincidan, mayor será tu porcentaje de compatibilidad.",
  rankingPartidos:
    "Ubica al partido entre los 18 partidos con representación en la Cámara de diputados. La posición se calcula considerando su asistencia, participación en votaciones, cohesión, representación distrital, mociones aprobadas y presentadas, oficios y cantidad de diputados(as).",
  rankingPartidosSenado:
    "Ubica al partido entre los 15 partidos con representación en la Cámara del Senado. La posición se calcula considerando su asistencia, participación en votaciones, cohesión, representación distrital, mociones aprobadas y presentadas, oficios y cantidad de senadores(as).",
  reaccionFueraDistrito:
    "Solo puedes dar «Me gusta» en representantes que pertenezcan a tu distrito.",
};

const Tooltip = ({
  children,
  text,
  width = 220,
  disabled = false,
  ajustarAlTexto = false,
  tooltipStyle,
  textStyle,
  arrowStyle,
  hitSlop,
}) => {
  const id = useRef(Symbol()).current;
  const containerRef = useRef(null);

  const { openTooltip, providerRef } = useTooltip();
  const [anchoTexto, setAnchoTexto] = useState(0);

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

            const anchoTooltip =
              ajustarAlTexto && anchoTexto > 0
                ? Math.ceil(anchoTexto) + 22
                : width;

            let left = x + triggerWidth / 2 - anchoTooltip / 2;

            if (left < margenPantalla) {
              left = margenPantalla;
            } else if (
              left + anchoTooltip >
              providerWidth - margenPantalla
            ) {
              left = providerWidth - margenPantalla - anchoTooltip;
            }

            const arrowOffsetX =
              x + triggerWidth / 2 - left - anchoTooltip * 0.1;

            openTooltip(id, {
              text,
              width: anchoTooltip,
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
      {ajustarAlTexto && typeof text === "string" && (
        <Text
          numberOfLines={1}
          style={[styles.measureText, textStyle]}
          onTextLayout={({ nativeEvent }) => {
            const ancho = nativeEvent.lines?.[0]?.width;

            if (ancho) {
              setAnchoTexto(ancho);
            }
          }}
        >
          {text}
        </Text>
      )}

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
  measureText: {
    position: "absolute",
    left: -10000,
    top: -10000,
    width: 1000,
    opacity: 0,
    fontSize: 13,
  },
});
