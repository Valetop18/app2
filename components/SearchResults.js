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

export const SearchResults = ({ data = [], onSelect, representante }) => {
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.container}
            onPress={() => onSelect(item)}
          >
            <View style={styles.containerNombre}>
              <View flexDirection={"row"}>
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
              <View style={styles.estadistica}>
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
                      marginRight={20}
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
                <FontAwesome name="thumbs-up" size={18} color={COLORS.grey} />
                <FontAwesome
                  name="thumbs-down"
                  size={18}
                  color={COLORS.grey}
                  style={{ transform: [{ scaleX: -1 }] }}
                />
              </View>
            </View>
            {item.descripcion && (
              <Text style={styles.descripcion}> {item.descripcion} </Text>
            )}
          </TouchableOpacity>
        )}
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
    marginRight: 5,
    marginTop: 10,
    justifyContent: 'space-between'
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
    marginTop: '-2%'
  },
  data2: {
    fontSize: 10,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
  },
  estadistica: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: '2%',
    marginTop: '-1%'
  },
  flexHorizontal: {
    flexDirection: 'row',

  },
  descripcion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12,
    color: COLORS.black,
    textAlign: "justify",
    marginHorizontal: "2%",
    lineHeight: 18,
    marginVertical: 5,
    width: '95%',
    alignSelf: 'center',
  },
});
