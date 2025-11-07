import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from "react-native";
import { COLORS } from "../constants/colors";
import { Topicos } from "../components/topico";
import { updateDoc, doc } from "firebase/firestore";
import { dbFirestore } from "../constants/config";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";

import { useState } from "react";

export const TopicosInteres = ({ route }) => {

  const navigation = useNavigation();
  const { uid } = route.params;
  console.log("uid: ", uid);

  const [seleccionados, setSeleccionados] = useState([]);

  const topico = [
    { id: 1, nombre: "Economía" },
    { id: 2, nombre: "Política" },
    { id: 3, nombre: "Recursos Naturales" },
    { id: 4, nombre: "Pesca" },
    { id: 5, nombre: "Medios de comunicación" },
    { id: 6, nombre: "Salud" },
    { id: 7, nombre: "Inmigración" },
    { id: 8, nombre: "Infancia" },
    { id: 9, nombre: "Seguridad" },
    { id: 10, nombre: "Feminismo" },
    { id: 11, nombre: "Minería" },
    { id: 12, nombre: "Medio Ambiente" },
    { id: 13, nombre: "Educación" },
    { id: 14, nombre: "Patrimonio" },
    { id: 15, nombre: "Derechos humanos" },
    { id: 16, nombre: "Tecnología" },
    { id: 17, nombre: "Agricultura" },
    { id: 18, nombre: "Sistema Judicial" },
    { id: 19, nombre: "Vivienda" },
    { id: 20, nombre: "Cultura" },
    { id: 21, nombre: "Sistema Previsional" },
    { id: 22, nombre: "Deporte" },
    { id: 23, nombre: "Familia" },
    { id: 24, nombre: "Sustancias psicoactivas" },
    { id: 25, nombre: "Energía" },
    { id: 26, nombre: "Ganadería" },
    { id: 27, nombre: "Leyes laborales" },
    { id: 28, nombre: "Urbanismo" },
    { id: 29, nombre: "Política Internacional" },
    { id: 30, nombre: "Turismo" },
    { id: 31, nombre: "Defensa nacional" },
    { id: 32, nombre: "Impuestos" },
    { id: 33, nombre: "Gobierno" },
    { id: 34, nombre: "Infancia" },
    { id: 35, nombre: "Adolescencia" },
    { id: 36, nombre: "Narcotráfico" },
    { id: 37, nombre: "Municipalidades" },
    { id: 37, nombre: "Gobiernos Regionales" },
  ];

  const toggleSelection = (nombre) => {
    console.log(nombre);

    setSeleccionados((prev) =>
      prev.includes(nombre)
        ? prev.filter((el) => el !== nombre)
        : [...prev, nombre]
    );
  };

  const handleContinuar = async () => {
    try {
      if ( seleccionados.length < 1 ) {
        Alert.alert("Selecciona al menos uno")
        return;
      }
      const docRef = doc(dbFirestore, "usuarios", uid);
      await updateDoc(docRef, { topicos: seleccionados });
      navigation.navigate("PartidoUsuario")
    } catch (error) {
      console.error(error);
    }
  };

  const renderGridItem = ({ item }) => {
    const isSelect = seleccionados.includes(item.nombre);

    return (
      <TouchableOpacity onPress={() => toggleSelection(item.nombre)} style={styles.topicoContainer}>
        <Topicos item={item} selected={isSelect} />
      </TouchableOpacity>
    );
  };

  const textContinuar = seleccionados.length < 1 ? "Selecciona al menos 1 tema" : "Continuar";

  return (
    <View style={styles.container}>
      <View style={styles.containerTitulo}>
        <Text style={styles.subTitulo}>
          Para tener una experiencia personalizada,
        </Text>
        <Text style={styles.titulo}>Selecciona tus temas de interés:</Text>
      </View>
      <View style={styles.containerFlatlist}>
        <FlatList
          data={topico}
          numColumns={3}
          style={styles.flatlist}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.containerFinal}>
        <TouchableOpacity
          onPress={handleContinuar}
          style={styles.containerContinuar}
        >
          <Text style={styles.textContinuar}>{textContinuar}</Text>
          <Ionicons name="chevron-forward-circle" size={28} color={COLORS.back}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.greenM,
    flex: 1,


  },
  containerTitulo: {
    marginTop: 65,
    paddingVertical: 20,
    paddingHorizontal: 30

  },
  titulo: {
    fontFamily: 'NotoSansMyanmar_600SemiBold',
    fontSize: 20,
    letterSpacing: 1,
    color: COLORS.back
  },
  subTitulo: {
    fontFamily: 'NotoSansMyanmar_600SemiBold',
    fontSize: 14,
    color: COLORS.grey
  },
  containerFlatlist: {
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  flatlist: {

  },
  topicoContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  columnWrapper : {
    justifyContent: 'center',
    gap: 5
  },
  containerFinal: {
    paddingRight: 20,
    paddingVertical: 25,

  },
  containerContinuar: {
    marginHorizontal: 20,
    marginLeft: 130,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  textContinuar: {
    width: "90%",
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 16,
    color: COLORS.back,
    letterSpacing: 0.5,
    textAlign: 'right',
    marginRight: 5
  }
});
