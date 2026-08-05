import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { COLORS } from "../constants/colors";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
  msFlaky,
  msJoinRight,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";

const TooltipVotaciones = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <MaterialIcons
          name="check-circle"
          size={18}
          color={COLORS.greenM}
        />

        <Text style={styles.text}>A favor</Text>
      </View>

      <View style={styles.row}>
        <MaterialIcons
          name="cancel"
          size={18}
          color={COLORS.FA}
        />

        <Text style={styles.text}>En contra</Text>
      </View>

      <View style={styles.row}>
        <MsIcon
          icon={msFlaky}
          size={18}
          color={COLORS.UDI}
        />

        <Text style={styles.text}>Abstención</Text>
      </View>

      <View style={styles.row}>
        <MsIcon
          icon={msJoinRight}
          size={19}
          color={COLORS.PDG}
        />

        <Text style={styles.text}>Pareo</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="remove-circle" size={18} color={COLORS.greyM} />

        <Text style={styles.text}>No voto</Text>
      </View>
    </View>
  );
};

export default TooltipVotaciones;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: COLORS.back
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },

  text: {
    color: COLORS.greenM,
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
  },
});