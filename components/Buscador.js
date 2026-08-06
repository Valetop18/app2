import React, { useContext } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { BuscadorContext } from "../context/BuscadorContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";

const responsiveBuscadorSize = (baseValue) => {
  return Math.min(
    responsiveWidthScale(baseValue),
    responsiveHeightScale(baseValue),
  );
};

const responsiveBuscadorText = (baseValue) => {
  return Math.max(11, responsiveBuscadorSize(baseValue));
};

const Buscador = ({ header = false }) => {
  const { search, setSearch } = useContext(BuscadorContext);

  return (
    <View
      style={[
        styles.container,
        header ? styles.containerHeader : styles.containerNormal,
      ]}
    >
      <Ionicons
        name="search-circle"
        size={responsiveBuscadorSize(23)}
        color={COLORS.greenM}
        style={{
          marginLeft: responsiveWidthScale(10),
          marginRight: responsiveWidthScale(4),
        }}
      />

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Ingresa una ley o tema de interés."
        style={styles.input}
        cursorColor={COLORS.black}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: responsiveHeightScale(38),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.back,
    marginVertical: "0.5%",
    elevation: 3,
    shadowColor: COLORS.black,
    borderRadius: responsiveWidthScale(5),
  },

  containerHeader: {
    width: responsiveWidthScale(330),
    maxWidth: "100%",
  },

  containerNormal: {
    width: "100%",
  },

  input: {
    flex: 1,
    height: "100%",
    fontFamily: FONTS.regular,
    fontSize: responsiveBuscadorText(13),
    color: COLORS.black,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});

export default Buscador;