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
import { msPersonRaisedHand } from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { reaccionesRepository } from "../infrastructure/ReaccionesRepository";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export const SearchResults = ({ data = [], onSelect, representante }) => {
  const { user } = useAuth();
  const [reacciones, setReacciones] = useState({});

  useEffect(() => {
    const loadReacciones = async () => {
      const data = await reaccionesRepository.getReacciones(user.id, "ley");

      if (data) {
        const mapReacciones = {};
        data.forEach((r) => {
          mapReacciones[r.target_id] = r.tipo_reaccion;
        });
        setReacciones(mapReacciones);
      }
    };

    loadReacciones();
  }, []);

  const handleLike = async (id, tipoReaccion) => {
    try {
      const actual = reacciones[id];

      const nueva = actual === tipoReaccion ? "null" : tipoReaccion;

      const resultado = reaccionesRepository.setReaccion(
        user.id,
        id,
        "ley",
        nueva,
      );

      setReacciones((prev) => ({
        ...prev,
        [id]: nueva,
      }));
      /**
       * ley_1 : like
       * ley_2 : dislike
       */

      console.log("resultado: ", resultado);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const reaccion = reacciones[item.id];

          return (
            <View style={styles.container}>
              <View flexDirection={"row"} justifyContent={"space-between"}>
                <View style={styles.containerNombre}>
                  <View flexDirection={"row"}>
                    <Text style={styles.nombre}> {item.nombre} </Text>
                    <View style={styles.estadistica2}>
                      <TouchableOpacity
                        onPress={() => handleLike(item.id, "like")}
                      >
                        <FontAwesome
                          name="thumbs-up"
                          size={19}
                          color={
                            reaccion === "like" ? COLORS.greenM : COLORS.grey
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleLike(item.id, "dislike")}
                      >
                        <FontAwesome
                          name="thumbs-down"
                          size={19}
                          color={
                            reaccion === "dislike" ? COLORS.greenM : COLORS.grey
                          }
                          style={{ transform: [{ scaleX: -1 }] }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.datausage}>
                      <MaterialIcons
                        name="data-usage"
                        size={34}
                        color={COLORS.verdeclaro}
                        position={"absolute"}
                      />
                      <Text style={styles.data2}>36%</Text>
                    </View>
                  </View>
                  <View
                    style={styles.estadistica}
                    onPress={() => onSelect(item)}
                  >
                    {representante && (
                      <View style={styles.flexHorizontal}>
                        <MsIcon
                          icon={msPersonRaisedHand}
                          size={18}
                          color={COLORS.black}
                        />
                        <MaterialIcons
                          name="cancel"
                          size={18}
                          color={COLORS.greenM}
                          marginRight={16}
                        />
                      </View>
                    )}

                    <MaterialCommunityIcons
                      name="chart-donut-variant"
                      size={22}
                      color={COLORS.black}
                    />
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color={COLORS.greenM}
                      marginRight={20}
                    />
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => onSelect(item)}>
                {item.descripcion && (
                  <Text style={styles.descripcion}> {item.descripcion} </Text>
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
    fontSize: 12,
    color: COLORS.black,
    marginHorizontal: "1%",
  },
  nombre: {
    fontFamily: "Sedan_400Regular",
    fontSize: 18,
    color: COLORS.greenM,
    marginHorizontal: 10,
    paddingVertical: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  datausage: {
    alignItems: "center",
    width: 34,
    height: 34,
    justifyContent: "center",
    marginTop: "-2%",
  },
  data2: {
    fontSize: 10,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
  },
  estadistica: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: '-2%'
  },
  estadistica2: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginRight: 8,
    width: 38,
  },
  flexHorizontal: {
    flexDirection: "row",
  },
  descripcion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12,
    color: COLORS.black,
    textAlign: "justify",
    marginHorizontal: "2%",
    lineHeight: 18,
    marginVertical: 5,
    width: "95%",
    alignSelf: "center",
  },
});
