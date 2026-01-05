import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const RepresentantePartido = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.containImage}>
        <Image
          style={{
            width: 28,
            height: 28,
            borderRadius: 100,
          }}
          source={item.foto}
        />
      </View>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <View alignSelf={'center'}>
      <MaterialIcons
        name="check-circle"
        size={18}
        color={COLORS.greenM}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  containImage: {
    marginRight: 10,

  },
  nombre: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,
    alignSelf: "center",
    width: 180,
  },
});

export default RepresentantePartido;
