import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import Ionicons from "@react-native-vector-icons/ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { MsIcon } from "material-symbols-react-native";
import { FontAwesome } from "@expo/vector-icons";

export const GridLeyes = ({ item }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onSelect(item)}>
      <View style={styles.containerNombre}>
        <View style={styles.containerCamara}>
          <Text style={styles.camara}>{item.camara}</Text>
          <View style={styles.circulo}>
            <Text style={styles.data2}>34%</Text>
          </View>
          <MaterialIcons name="check-circle" size={18} color={COLORS.greenM} />
        </View>
        <View style={styles.estadistica}>
          <Text style={styles.fecha}> {item.fecha} </Text>
          <FontAwesome name="thumbs-up" size={18} color={COLORS.grey} />
          <FontAwesome
            name="thumbs-down"
            size={18}
            color={COLORS.grey}
            style={{ transform: [{ scaleX: -1 }] }}
          />
        </View>
      </View>
      <View style={styles.conteinerLey}>
        <Text style={styles.nombre}> {item.nombre} </Text>
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
      <Text style={styles.descripcion}> {item.descripcion} </Text>
    </TouchableOpacity>
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
    elevation: 3,
    shadowColor: COLORS.black,
    borderRadius: 10,
  },
  containerNombre: {
    flexDirection: "row",
    marginRight: 5,
    marginTop: 5,
    justifyContent: "space-between",
    width: "96%",
    alignSelf: "center",
  },
  containerCamara: {
    flexDirection: "row",
    alignItems: "center",
  },
  votacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12,
    color: COLORS.black,
    marginHorizontal: "1%",
  },
  camara: {
    fontSize: 16,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
    marginLeft: 10,
    marginRight: 7,
  },
  circulo: {
    marginHorizontal: "1%",
    alignItems: "center",
    width: 28,
    height: 28,
    justifyContent: "center",
    backgroundColor: COLORS.verdeclaro,
    borderRadius: 100,
  },
  data2: {
    fontSize: 12,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
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
    marginTop: -3,
    marginRight: "1%",
  },
  data2: {
    fontSize: 10,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
  },
  estadistica: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: "1%",
  },
  fecha: {
    fontSize: 12,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
    marginRight: 7,
  },
  conteinerLey: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "94%",
    alignSelf: "center",

  },
  descripcion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12,
    color: COLORS.black,
    textAlign: "justify",
    marginHorizontal: "2%",
    lineHeight: 18,
    marginVertical: 5,
    width: "94%",
    alignSelf: "center",
  },
});
