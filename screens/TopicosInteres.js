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
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { topicosRepository } from "../infrastructure/TopicosRepository";

export const TopicosInteres = () => {

  const { user } = useAuth();

  const uid = user.id;

  const navigation = useNavigation();

  const [topicos, setTopicos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);


  useEffect(() => {
    cargarTopicos();
  }, []);

  const cargarTopicos = async () => {

    try {

      const data = await topicosRepository.getTopicos();
      setTopicos(data); 
    } catch (error) {
      
    }finally {

    }


  }

  const toggleSelection = (id) => {

    setSeleccionados((prev) =>
      prev.includes(id)
        ? prev.filter((el) => el !== id)
        : [...prev, id]
    );
  };

  const handleContinuar = async () => {
    try {
      if ( seleccionados.length < 1 ) {
        Alert.alert("Selecciona al menos uno")
        return;
      }
      await topicosRepository.saveUserTopicos(uid, seleccionados );
      navigation.navigate("PartidoUsuario")
    } catch (error) {
      console.error(error);
    }
  };

  const renderGridItem = ({ item }) => {
    const isSelect = seleccionados.includes(item.id);

    return (
      <TouchableOpacity onPress={() => toggleSelection(item.id)} style={styles.topicoContainer}>
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
          data={topicos}
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
