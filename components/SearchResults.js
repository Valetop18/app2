import React from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants/colors";
import Ionicons from "@react-native-vector-icons/ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
  msPersonRaisedHand,
  msJoin,
  msFlaky,
  msJoinRight,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useReacciones } from "../context/ReaccionesContext";
import { responsiveWidthScale } from "../utils/responsive";
import { useAuth } from "../context/AuthContext";
import TooltipVotaciones from "./TooltipVotaciones";
import Tooltip from "./tooltip";
import { FONTS } from "../constants/fonts";

export const SearchResults = ({ data = [], onSelect, representante }) => {
  const { reaccionesLey, setReaccionLey } = useReacciones();
  const [resultados, setResultados] = React.useState(data);
  const { puedeInteractuar } = useAuth();

  React.useEffect(() => {
    setResultados(data);
  }, [data]);

  const handleReaccion = async (idVotacion, tipoReaccion) => {
    if (!puedeInteractuar) {
      return;
    }

    try {
      const cambio = await setReaccionLey(idVotacion, tipoReaccion);

      if (!cambio) return;

      const { anterior, nueva } = cambio;

      setResultados((prev) =>
        prev.map((item) => {
          if (Number(item.id) !== Number(idVotacion)) {
            return item;
          }

          let totalLikes = Number(item.totalLikes ?? 0);
          let totalDislikes = Number(item.totalDislikes ?? 0);

          // Quitar la reacción anterior del conteo
          if (anterior === "like") {
            totalLikes = Math.max(totalLikes - 1, 0);
          }

          if (anterior === "dislike") {
            totalDislikes = Math.max(totalDislikes - 1, 0);
          }

          // Agregar la nueva reacción
          if (nueva === "like") {
            totalLikes += 1;
          }

          if (nueva === "dislike") {
            totalDislikes += 1;
          }

          return {
            ...item,
            totalLikes,
            totalDislikes,
          };
        }),
      );
    } catch (error) {
      console.error("Error actualizando reacción:", error);
    }
  };

  const IconoPorVoto = ({ voto }) => {
    if (!voto) {
      return (
        <Ionicons
          name="remove-circle"
          size={responsiveWidthScale(18)}
          color={COLORS.greyM}
        />
      );
    }

    const v = voto.toLowerCase();

    if (v.includes("favor")) {
      return (
        <MaterialIcons
          name="check-circle"
          size={responsiveWidthScale(18)}
          color={COLORS.greenM}
        />
      );
    }

    if (v.includes("contra")) {
      return (
        <MaterialIcons
          name="cancel"
          size={responsiveWidthScale(18)}
          color={COLORS.FA}
        />
      );
    }

    if (v.includes("pareo")) {
      return (
        <MsIcon
          icon={msJoinRight}
          size={responsiveWidthScale(19)}
          color={COLORS.PDG}
        />
      );
    }

    if (v.includes("absten")) {
      return (
        <MsIcon
          icon={msFlaky}
          size={responsiveWidthScale(18)}
          color={COLORS.UDI}
        />
      );
    }

    return null;
  };

  const IconoPorResultado = ({ resultado }) => {
    if (!resultado) return null;

    const v = resultado.toLowerCase();

    if (v.includes("aprobado")) {
      return (
        <MaterialIcons
          name="check-circle"
          size={responsiveWidthScale(18)}
          color={COLORS.greenM}
          marginRight={responsiveWidthScale(18)}
        />
      );
    }

    if (v.includes("rechazado")) {
      return (
        <MaterialIcons
          name="cancel"
          size={responsiveWidthScale(18)}
          color={COLORS.FA}
          marginRight={responsiveWidthScale(18)}
        />
      );
    }

    return null;
  };

  return (
    <View>
      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const reaccion = reaccionesLey[item.id];
          const esVotoAFavor = item?.votoRepresentante
            ?.toLowerCase()
            .includes("favor");
          return (
            <View style={styles.container}>
              <View flexDirection={"row"} justifyContent={"space-between"}>
                <View style={styles.containerNombre}>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <Text style={styles.nombre}>
                      {item.boletin
                        ? `Boletín N° ${item.boletin}`
                        : item.tipoDocumento}
                    </Text>

                    <View style={styles.reaccionesResumen}>
                      <TouchableOpacity
                        style={styles.reaccionGrupo}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 5 }}
                        activeOpacity={0.65}
                        onPress={() => handleReaccion(item.id, "like")}
                      >
                        <Text
                          style={[
                            styles.reaccionCantidad,
                            reaccion === "like" &&
                            styles.reaccionCantidadActiva,
                          ]}
                        >
                          {item.totalLikes ?? 0}
                        </Text>

                        <FontAwesome
                          name="thumbs-up"
                          size={responsiveWidthScale(18)}
                          color={
                            reaccion === "like" ? COLORS.greenM : COLORS.grey
                          }
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.reaccionGrupo}
                        hitSlop={{ top: 8, bottom: 8, left: 5, right: 8 }}
                        activeOpacity={0.65}
                        onPress={() => handleReaccion(item.id, "dislike")}
                      >
                        <FontAwesome
                          name="thumbs-down"
                          size={responsiveWidthScale(18)}
                          color={
                            reaccion === "dislike" ? COLORS.greenM : COLORS.grey
                          }
                          style={{ transform: [{ scaleX: -1 }] }}
                        />

                        <Text
                          style={[
                            styles.reaccionCantidad,
                            reaccion === "dislike" &&
                            styles.reaccionCantidadActiva,
                          ]}
                        >
                          {item.totalDislikes ?? 0}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={styles.estadistica}
                    onPress={() => onSelect(item)}
                  >
                    {representante && (
                      <Tooltip
                        width={responsiveWidthScale(115)}
                        hitSlop={responsiveWidthScale(6)}
                        text={
                          <TooltipVotaciones voto={item?.votoRepresentante} />
                        }
                        tooltipStyle={
                          esVotoAFavor
                            ? { backgroundColor: COLORS.back }
                            : undefined
                        }
                        arrowStyle={
                          esVotoAFavor
                            ? { backgroundColor: COLORS.back }
                            : undefined
                        }
                      >
                        <View style={styles.flexHorizontal}>
                          <MsIcon
                            icon={msPersonRaisedHand}
                            size={responsiveWidthScale(18)}
                            color={COLORS.black}
                          />

                          <IconoPorVoto voto={item?.votoRepresentante} />
                        </View>
                      </Tooltip>
                    )}

                    <MaterialCommunityIcons
                      name="chart-donut-variant"
                      size={responsiveWidthScale(22)}
                      color={COLORS.black}
                    />
                    <IconoPorResultado resultado={item?.resultado} />
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => onSelect(item)}>
                {item.tema ? (
                  // SENADORES
                  <Text style={styles.descripcion}>
                    {item.tema}
                  </Text>
                ) : (
                  // DIPUTADOS
                  <>
                    {item.materia_resumen ? (
                      <Text style={styles.descripcion}>
                        {item.materia_resumen}
                        <Text style={styles.resumenIA}>✨Resumen IA</Text>
                      </Text>
                    ) : (
                      <Text style={styles.descripcion}>
                        {item.materia}
                      </Text>
                    )}

                    {item.articulo_resumen ? (
                      <Text style={styles.articulo}>
                        {item.articulo_resumen}{" "}
                        <Text style={styles.resumenIA}>✨Resumen IA</Text>
                      </Text>
                    ) : item.articulo ? (
                      <Text style={styles.articulo}>
                        {item.articulo}
                      </Text>
                    ) : null}
                  </>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={<Text> sin resultados </Text>}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.back,
    width: "96%",
    marginTop: "1%",
    marginVertical: "0.5%",
    marginHorizontal: "2%",
    borderRadius: responsiveWidthScale(10),

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

  containerNombre: {
    flexDirection: "row",
    marginTop: responsiveWidthScale(10),
    justifyContent: "space-between",
    width: "100%",
  },

  votacion: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(12)),
    color: COLORS.black,
    marginHorizontal: "1%",
  },

  nombre: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(14.5)),
    color: COLORS.greenM,
    marginLeft: responsiveWidthScale(10),
    marginHorizontal: responsiveWidthScale(6),
    paddingVertical: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },

  datausage: {
    alignItems: "center",
    width: responsiveWidthScale(34),
    height: responsiveWidthScale(34),
    justifyContent: "center",
    marginTop: "-2%",
  },

  data2: {
    fontSize: Math.max(11, responsiveWidthScale(10)),
    fontFamily: FONTS.bold,
    color: COLORS.greenM,
  },

  estadistica: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "-2%",
  },

  estadistica2: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginRight: responsiveWidthScale(6),
    width: responsiveWidthScale(38),
  },

  flexHorizontal: {
    flexDirection: "row",
    marginRight: responsiveWidthScale(16),
  },

  descripcion: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(14)),
    color: COLORS.black,
    textAlign: "justify",
    marginHorizontal: "2%",
    lineHeight: responsiveWidthScale(18),
    marginVertical: responsiveWidthScale(4),
    marginTop: responsiveWidthScale(7),
    width: "95%",
    alignSelf: "center",
  },

  resumenIA: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(11.5)),
    color: COLORS.greyM,
  },

  articulo: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    color: COLORS.black,
    textAlign: "justify",
    marginHorizontal: "2%",
    lineHeight: responsiveWidthScale(18),
    marginVertical: responsiveWidthScale(5),
    width: "95%",
    alignSelf: "center",
  },

  reaccionesResumen: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveWidthScale(7),
    marginLeft: responsiveWidthScale(1),
    paddingHorizontal: responsiveWidthScale(6),
    paddingVertical: responsiveWidthScale(3),
    borderRadius: responsiveWidthScale(14),
    backgroundColor: "#F6F8F6",
  },

  reaccionGrupo: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveWidthScale(4),
  },

  reaccionCantidad: {
    minWidth: responsiveWidthScale(15),
    textAlign: "center",
    fontSize: Math.max(11, responsiveWidthScale(11)),
    lineHeight: responsiveWidthScale(15),
    fontFamily: FONTS.bold,
    color: COLORS.greyM,
  },

  reaccionBoton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: responsiveWidthScale(3),
    paddingVertical: responsiveWidthScale(2),
    borderRadius: responsiveWidthScale(10),
  },

  reaccionCantidadActiva: {
    color: COLORS.greenM,
  },
});
