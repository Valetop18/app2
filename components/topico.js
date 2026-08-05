import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";
import { FONTS } from "../constants/fonts";

export const Topicos = ({ item, selected }) => {
  const borderColor = COLORS.back;
  const backgroundColor = selected ? COLORS.verdeclaro : COLORS.greenM;
  const color = selected ? COLORS.greenM : COLORS.back;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.containerTopico,
          {
            borderColor,
            backgroundColor,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.topico,
            {
              color,
            },
          ]}
        >
          {item.nombre}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: responsiveHeightScale(4),
    paddingHorizontal: responsiveWidthScale(2),
  },

  containerTopico: {
    minHeight: responsiveHeightScale(38),
    paddingVertical: responsiveHeightScale(2.1),
    paddingHorizontal: responsiveWidthScale(9),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: responsiveWidthScale(2),
    borderRadius: responsiveWidthScale(10),
  },

  topico: {
    fontFamily: FONTS.medium,
    fontSize: Math.max(11, responsiveWidthScale(15)),
    textAlign: "center",
    includeFontPadding: false,
  },
});