import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import Ionicons from "@react-native-vector-icons/ionicons";

export const Partido = ({ item, selected }) => {
  const color = selected ? COLORS.back : COLORS.back;
  const fontFamily = selected
    ? "NotoSansMyanmar_800ExtraBold"
    : "NotoSansMyanmar_400Regular";

  return (
    <View style={styles.container}>
      {selected ? (
        <Ionicons name="checkmark-circle" size={21} color={COLORS.back} />
      ) : (
        <Ionicons name="chevron-forward-circle" size={16} color={COLORS.back} />
      )}
      <Text
        style={[styles.topico, { color, fontFamily }]}
      >{`${item.nombre} (${item.sigla})`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: "1%",
    paddingVertical: 2,
  },
  topico: {
    color: COLORS.back,
    fontSize: 15,
    fontFamily: "NotoSansMyanmar_400Regular",
    paddingLeft: 6,
  },
});
