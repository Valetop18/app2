import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  responsiveVerticalSize,
  responsiveSpacing,
  responsiveFont,
  responsiveIcon,
} from "../utils/responsive";

export const Partido = ({ item, selected }) => {
  const fontFamily = selected
    ? "NotoSansMyanmar_800ExtraBold"
    : "NotoSansMyanmar_400Regular";

  return (
    <View style={styles.container}>
      {selected ? (
        <Ionicons
          name="checkmark-circle"
          size={responsiveIcon(21)}
          color={COLORS.back}
        />
      ) : (
        <Ionicons
          name="chevron-forward-circle"
          size={responsiveIcon(16)}
          color={COLORS.back}
        />
      )}

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
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
    paddingHorizontal: responsiveSpacing(2),
    paddingVertical: responsiveVerticalSize(2),
  },

  topico: {
    flex: 1,
    color: COLORS.back,
    fontSize: responsiveFont(15),
    paddingLeft: responsiveSpacing(6),
  },
});
