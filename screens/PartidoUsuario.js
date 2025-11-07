import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { Partido } from "../components/partido";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { dbFirestore } from "../constants/config";

export const PartidoUsuario = () => {
  const navigation = useNavigation();

  const [partidoSeleccionado, setPartidoSeleccionado] = useState("");

  const partidos = [
    { id: 1, partido: "Partido Liberal (PL)" },
    { id: 2, partido: "Partido Socialista (PS)" },
    { id: 3, partido: "Partido Comunista (PC)" },
    { id: 4, partido: "Partido Unión Demócrata Independiente (UDI)" },
    { id: 5, partido: "Renovación Nacional (RN)" },
    { id: 6, partido: "Revolución Democrática (RD)" },
    { id: 7, partido: "Federación Regionalista Verde Social (FRVS)" },
    { id: 8, partido: "Partido Demócrata Cristiano (PDC)" },
    { id: 9, partido: "Partido de la Gente (PDG)" },
    { id: 10, partido: "Partido Convergencia Social (PCS)" },
    { id: 11, partido: "Partido Republicano (PR)" },
    { id: 12, partido: "Partido Por la Democracia (PPD)" },
    { id: 13, partido: "Partido Comunes" },
    { id: 14, partido: "Partido Ecologista Verde (PEV)" },
    { id: 15, partido: "Partido Evolución Política (EVOPOLI)" },
    { id: 16, partido: "Partido Humanista (PH)" },
    { id: 17, partido: "Partido Radical Socialdemócrata (PRSD)" },
  ];

  const renderGridItem = ({ item }) => {

  const onPress = () => setPartidoSeleccionado(item.partido);
  const isSelected = item.partido === partidoSeleccionado;

  return(
  <TouchableOpacity onPress={onPress}>
    <Partido item={item} selected={isSelected}/>
  </TouchableOpacity>
  );
  };

  const handleContinuar = async () => {
    try {

      const docRef = doc(dbFirestore, "usuarios", "ixqqyDrxLXa8lk7FyareoyCWHts2");
      await updateDoc(docRef, { partido: partidoSeleccionado});
      navigation.navigate("SelectDistrito");
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.conteinerTitulo}>
        <Text style={styles.subTitulo}>
          Solo si te sientes parte, si no omítelo,
        </Text>
        <Text style={styles.titulo}>Selecciona un partido:</Text>
        <View marginTop={"3%"}>
          <FlatList
            style={styles.flatlist}
            data={partidos}
            renderItem={renderGridItem}
            numColumns={1}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.containerFinal}>
          <TouchableOpacity
            style={styles.buttonIngresar}
            onPress={handleContinuar}
          >
            <Text style={styles.boton}>Continuar</Text>
            <Ionicons
              name="chevron-forward-circle"
              size={30}
              color={COLORS.back}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "10%",
    paddingHorizontal: "5%",
    backgroundColor: COLORS.greenM,
    alignContent: "center",
  },
  conteinerTitulo: {
    top: "7%",
    marginLeft: "4%",
    paddingVertical: "2%",
    position: "relative",
    justifyContent: "center",
  },
  titulo: {
    color: COLORS.back,
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: "NotoSansMyanmar_700Bold",
    marginVertical: "1%",
  },
  subTitulo: {
    color: COLORS.grey,
    fontSize: 14,
    fontFamily: "NotoSansMyanmar_700Bold",
  },
  flatlist: {
    top: "1%",
  },
  buttonIngresar: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: "25%",
    flexDirection: "row",

  },
  boton: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 18,
    color: COLORS.back,
    marginRight: "2%",
    letterSpacing: 1,
  },
  containerFinal: {
    alignItems: 'flex-end',
    marginTop: "15%",
  },
});
