import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { COLORS } from "../constants/colors";
import {
  responsiveVerticalSize,
  responsiveSpacing,
  responsiveFont,
  responsiveSize,
} from "../utils/responsive";

export const Topicos = ({ item, selected }) => {
  const { width } = useWindowDimensions();

  const pantallaPequena = width < 390;
  const pantallaMuyPequena = width < 350;

  const borderColor = COLORS.back;
  const backgroundColor = selected ? COLORS.verdeclaro : COLORS.greenM;
  const color = selected ? COLORS.greenM : COLORS.back;

  const fontSize = pantallaMuyPequena
    ? responsiveFont(12.5)
    : pantallaPequena
      ? responsiveFont(13.5)
      : responsiveFont(15);

  const paddingHorizontal = pantallaMuyPequena
    ? responsiveSpacing(5)
    : pantallaPequena
      ? responsiveSpacing(7)
      : responsiveSpacing(9);

  return (
    <View
      style={[
        styles.container,
        pantallaPequena && styles.containerPequeno,
      ]}
    >
      <View
        style={[
          styles.containerTopico,
          {
            borderColor,
            backgroundColor,
            paddingHorizontal,
          },
          pantallaPequena && styles.containerTopicoPequeno,
        ]}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          style={[
            styles.topico,
            {
              color,
              fontSize,
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
    paddingVertical: responsiveVerticalSize(4),
    paddingHorizontal: responsiveSpacing(2),
  },

  containerPequeno: {
    paddingVertical: responsiveVerticalSize(3),
    paddingHorizontal: responsiveSpacing(1),
  },

  containerTopico: {
    minHeight: responsiveVerticalSize(38),
    paddingVertical: responsiveVerticalSize(2.1),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: responsiveSize(2),
    borderRadius: responsiveSize(10),
  },

  containerTopicoPequeno: {
    minHeight: responsiveVerticalSize(34),
    paddingVertical: responsiveVerticalSize(2),
    borderRadius: responsiveSize(9),
  },

  topico: {
    fontFamily: "NotoSansMyanmar_600SemiBold",
    textAlign: "center",
    includeFontPadding: false,
  },
});