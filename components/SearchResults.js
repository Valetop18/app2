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
import {
  responsiveSize,
  responsiveFont,
  responsiveIcon,
  responsiveSpacing,
} from "../utils/responsive";
import { useAuth } from "../context/AuthContext";
import TooltipVotaciones from "./TooltipVotaciones";
import Tooltip from "./tooltip";

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
    if (!voto)
      return <Ionicons name="remove-circle" size={18} color={COLORS.greyM} />;

    const v = voto.toLowerCase();

    if (v.includes("favor")) {
      return (
        <MaterialIcons name="check-circle" size={18} color={COLORS.greenM} />
      );
    }

    if (v.includes("contra")) {
      return <MaterialIcons name="cancel" size={18} color={COLORS.FA} />;
    }

    if (v.includes("pareo")) {
      return <MsIcon icon={msJoinRight} size={19} color={COLORS.PDG} />;
    }

    if (v.includes("absten")) {
      return <MsIcon icon={msFlaky} size={18} color={COLORS.UDI} />;
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
          size={responsiveIcon(18)}
          color={COLORS.greenM}
          marginRight={responsiveSpacing(18)}
        />
      );
    }

    if (v.includes("rechazado")) {
      return (
        <MaterialIcons
          name="cancel"
          size={responsiveIcon(18)}
          color={COLORS.FA}
          marginRight={responsiveSpacing(18)}
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

          return (
            <View style={styles.container}>
              <View flexDirection={"row"} justifyContent={"space-between"}>
                <View style={styles.containerNombre}>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <Text style={styles.nombre}> {item.tipoDocumento} </Text>

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
                          size={responsiveIcon(18)}
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
                          size={responsiveIcon(18)}
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
                      <Tooltip width={140} text={<TooltipVotaciones />}>
                        <View style={styles.flexHorizontal}>
                          <MsIcon
                            icon={msPersonRaisedHand}
                            size={responsiveIcon(18)}
                            color={COLORS.black}
                          />

                          <IconoPorVoto voto={item?.votoRepresentante} />
                        </View>
                      </Tooltip>
                    )}

                    <MaterialCommunityIcons
                      name="chart-donut-variant"
                      size={responsiveIcon(22)}
                      color={COLORS.black}
                    />
                    <IconoPorResultado resultado={item?.resultado} />
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => onSelect(item)}>
                {item.materia_resumen ? (
                  <Text style={styles.descripcion}>
                    {item.materia_resumen}
                    <Text style={styles.resumenIA}>✨Resumen IA</Text>
                  </Text>
                ) : (
                  <Text style={styles.descripcion}> {item.materia} </Text>
                )}
                {item.articulo_resumen ? (
                  <Text style={styles.articulo}>
                    {item.articulo_resumen}{" "}
                    <Text style={styles.resumenIA}>✨Resumen IA</Text>
                  </Text>
                ) : item.articulo ? (
                  <Text style={styles.articulo}> {item.articulo} </Text>
                ) : null}
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
    marginTop: "01%",
    marginVertical: "0.5%",
    marginHorizontal: "2%",
    elevation: 3,
    shadowColor: COLORS.black,
    borderRadius: 10,
  },
  containerNombre: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  votacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: responsiveFont(12),
    color: COLORS.black,
    marginHorizontal: "1%",
  },

  nombre: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(14.5),
    color: COLORS.greenM,
    marginLeft: 10,
    marginHorizontal: 6,
    paddingVertical: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  datausage: {
    alignItems: "center",
    width: responsiveSize(34),
    height: responsiveSize(34),
    justifyContent: "center",
    marginTop: "-2%",
  },
  data2: {
    fontSize: responsiveFont(10),
    fontFamily: "NotoSansMyanmar_700Bold",
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
    marginRight: 6,
    width: 38,
  },
  flexHorizontal: {
    flexDirection: "row",
    marginRight: 16,
  },
  descripcion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: responsiveFont(14),
    color: COLORS.black,
    textAlign: "justify",
    marginHorizontal: "2%",
    lineHeight: responsiveSize(18),
    marginVertical: 4,
    marginTop: 7,
    width: "95%",
    alignSelf: "center",
  },
  resumenIA: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(11.5),
    color: COLORS.greyM,
  },
  articulo: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: responsiveFont(13),
    color: COLORS.black,
    textAlign: "justify",
    marginHorizontal: "2%",
    lineHeight: responsiveSize(18),
    marginVertical: 5,
    width: "95%",
    alignSelf: "center",
  },
  reaccionesResumen: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveSpacing(7),
    marginLeft: responsiveSpacing(1),
    paddingHorizontal: responsiveSpacing(6),
    paddingVertical: responsiveSpacing(3),
    borderRadius: responsiveSize(14),
    backgroundColor: "#F6F8F6",
  },
  reaccionGrupo: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveSpacing(4),
  },
  reaccionCantidad: {
    minWidth: responsiveSize(15),
    textAlign: "center",
    fontSize: responsiveFont(11),
    lineHeight: responsiveSize(15),
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greyM,
  },
  reaccionBoton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: responsiveSpacing(3),
    paddingVertical: responsiveSpacing(2),
    borderRadius: responsiveSize(10),
  },
  reaccionCantidadActiva: {
    color: COLORS.greenM,
  },
});
