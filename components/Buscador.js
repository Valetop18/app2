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

const Buscador = ({
  header = false,
  value,
  onChangeText,
  placeholder = "Ingresa una ley o tema de interés.",
}) => {
  const { search, setSearch } = useContext(BuscadorContext);

  const valorVisible = value !== undefined ? value : search;
  const cambiarTexto = onChangeText ?? setSearch;

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
        value={valorVisible}
        onChangeText={cambiarTexto}
        placeholder={placeholder}
        placeholderTextColor={COLORS.greyM}
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
    borderRadius: responsiveWidthScale(5),

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

  containerHeader: {
    width: responsiveWidthScale(320),
    maxWidth: "100%",
    marginBottom: responsiveHeightScale(13),
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