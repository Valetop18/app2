import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS } from "../constants/colors";
import { Topicos } from "../components/topico";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { topicosRepository } from "../infrastructure/TopicosRepository";
import { Skeleton } from "../components/Skeleton";
import Modal from "react-native-modal";
import { msCancel } from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";

export const TopicosInteres = () => {
  const { user } = useAuth();

  const uid = user.id;

  const navigation = useNavigation();

  const [topicos, setTopicos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    cargarTopicos();
  }, []);

  const cargarTopicos = async () => {
    try {
      const data = await topicosRepository.getTopicos();
      setTopicos(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id],
    );
  };

  const handleContinuar = async () => {
    try {
      if (seleccionados.length < 1) {
        setModalVisible(true);
        return;
      }
      await topicosRepository.saveUserTopicos(uid, seleccionados);
      navigation.navigate("PartidoUsuario");
    } catch (error) {
      console.error(error);
    }
  };

  const renderGridItem = ({ item }) => {
    const isSelect = seleccionados.includes(item.id);

    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item.id)}
        style={styles.topicoContainer}
      >
        <Topicos item={item} selected={isSelect} />
      </TouchableOpacity>
    );
  };

  const textContinuar =
    seleccionados.length < 1 ? "Selecciona al menos 1 tema" : "Continuar";

  const skeletonCard = () => (
    <View
      style={{
        alignSelf: "center",
        paddingVertical: 8,
        paddingHorizontal: 8,
      }}
    >
      <Skeleton width={112} height={35} borderRadius={5} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <View
          style={{
            height: "16%",
            width: "100%",
            backgroundColor: COLORS.back,
            justifyContent: "center",
            alignItems: "center",
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
            paddingHorizontal: 25,
          }}
        >
          <View style={{ alignSelf: "flex-end" }}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialIcons name="cancel" size={20} color={COLORS.grey} />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <MsIcon icon={msCancel} size={45} color={COLORS.greenM} />
            <Text style={styles.textModal}>Debes seleccionar al menos un tema</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.containerTitulo}>
        <Text style={styles.subTitulo}>
          Para tener una experiencia personalizada,
        </Text>
        <Text style={styles.titulo}>Selecciona tus temas de interés:</Text>
      </View>
      <View style={styles.containerFlatlist}>
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
            numColumns={3}
            style={styles.flatlist}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={skeletonCard}
            keyExtractor={(item) => item.toString()}
          />
        ) : (
          <FlatList
            data={topicos}
            numColumns={3}
            style={styles.flatlist}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={renderGridItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      <View style={styles.containerFinal}>
        <TouchableOpacity
          onPress={handleContinuar}
          style={styles.containerContinuar}
        >
          <Text style={styles.textContinuar}>{textContinuar}</Text>
          <Ionicons
            name="chevron-forward-circle"
            size={28}
            color={COLORS.back}
          />
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
    paddingHorizontal: 30,
  },
  textModal: {
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.black,
    fontSize: 15,
  },
  titulo: {
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontSize: 20,
    letterSpacing: 1,
    color: COLORS.back,
  },
  subTitulo: {
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontSize: 14,
    color: COLORS.grey,
  },
  containerFlatlist: {
    display: "flex",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  flatlist: {},
  topicoContainer: {
    alignSelf: "center",
    justifyContent: "center",
  },
  columnWrapper: {
    justifyContent: "center",
    gap: 5,
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
    alignItems: "center",
  },
  textContinuar: {
    width: "90%",
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 16,
    color: COLORS.back,
    letterSpacing: 0.5,
    textAlign: "right",
    marginRight: 5,
  },
});
