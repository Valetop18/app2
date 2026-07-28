import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export const Splash = () => {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.nombre}>nawi</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "15%",
    paddingHorizontal: "5%",
    backgroundColor: COLORS.greenM,
    alignContent: "center",
  },
  nombre: {
    color: "white",
    fontFamily: "Sedan_400Regular",
    fontSize: 120,
    letterSpacing: 8,
  },
  title: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: "60%",
    marginRight: "4%",
  },
});