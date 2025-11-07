import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export const Topicos = ({item, selected}) => {

    const borderColor = selected ? COLORS.back : COLORS.back;
    const backgroundColor = selected ? COLORS.verdeclaro : COLORS.greenM;
    const color = selected ? COLORS.greenM : COLORS.back;

    return(
        <View style={styles.container}>
            <View style={ [styles.conteinerTopico, { borderColor, backgroundColor   }] }>
                <Text style={ [styles.topico, { color  }] }>{item.nombre}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: "2.4%",
    paddingHorizontal: "2%",

  },
  conteinerTopico: {
    top: "1%",
    paddingVertical: '1%',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10, 
  },
  topico: {
    color: COLORS.back,
    fontSize: 15,
    fontFamily: "NotoSansMyanmar_600SemiBold",
    marginVertical: "1%",
    marginHorizontal: '1.5%',
  },
})