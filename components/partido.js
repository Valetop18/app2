import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";
import { FONTS } from "../constants/fonts";

export const Partido = ({ item, selected }) => {
  const fontFamily = selected ? FONTS.bold : FONTS.regular;

  const iconoSeleccionado = Math.min(
    responsiveWidthScale(21),
    responsiveHeightScale(21),
  );

  const iconoNormal = Math.min(
    responsiveWidthScale(16),
    responsiveHeightScale(16),
  );

  return (
    <View style={styles.container}>
      <Ionicons
        name={selected ? "checkmark-circle" : "chevron-forward-circle"}
        size={selected ? iconoSeleccionado : iconoNormal}
        color={COLORS.back}
      />

      <Text
        numberOfLines={1}
        style={[styles.topico, { fontFamily }]}
      >
        {`${item.nombre} (${item.sigla})`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: responsiveWidthScale(2),
    paddingVertical: responsiveHeightScale(5),
  },

  topico: {
    flex: 1,
    color: COLORS.back,
    fontSize: Math.max(
      11,
      Math.min(
        responsiveWidthScale(15),
        responsiveHeightScale(15),
      ),
    ),
    paddingLeft: responsiveWidthScale(6),
    top: responsiveHeightScale(-1),
  },
});