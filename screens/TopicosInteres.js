import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { COLORS } from "../constants/colors";
import { Topicos } from "../components/topico";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { topicosRepository } from "../infrastructure/TopicosRepository";
import { Skeleton } from "../components/Skeleton";
import { msCancel } from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
  responsiveVerticalSize,
  responsiveSpacing,
  responsiveFont,
  responsiveIcon,
  responsiveSize,
} from "../utils/responsive";

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
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={{ alignSelf: "flex-end" }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons
                  name="cancel"
                  size={responsiveIcon(20)}
                  color={COLORS.back}
                />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MsIcon icon={msCancel} size={36} color={COLORS.back} />
              <Text style={styles.textModal}>
                Debes seleccionar al menos un tema
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
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
            contentContainerStyle={styles.flatlistContent}
            keyExtractor={(item) => item.toString()}
          />
        ) : (
          <FlatList
            data={topicos}
            numColumns={3}
            contentContainerStyle={styles.flatlistContent}
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
            size={responsiveIcon(28)}
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
    marginTop: responsiveVerticalSize(55),
    paddingVertical: responsiveVerticalSize(20),
    paddingHorizontal: responsiveSpacing(30),
  },
  textModal: {
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.back,
    fontSize: 15,
    marginTop: '2%'
  },
  titulo: {
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontSize: responsiveFont(20),
    letterSpacing: 1,
    color: COLORS.back,
  },
  subTitulo: {
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontSize: responsiveFont(14),
    color: COLORS.grey,
  },
  containerFlatlist: {
    flexShrink: 1,
    alignItems: "center",
    paddingVertical: responsiveVerticalSize(10),
    paddingHorizontal: responsiveSpacing(5),
    justifyContent: "flex-start",
  },
  flatlist: {
    width: "100%",
  },
  topicoContainer: {
    alignSelf: "center",
    justifyContent: "center",
  },
  columnWrapper: {
    justifyContent: "center",
    alignItems: "center",
    gap: responsiveSpacing(3),
  },
  containerFinal: {
    justifyContent: "flex-end",
    paddingTop: responsiveVerticalSize(18),
    paddingBottom: responsiveVerticalSize(48),
  },
  flatlistContent: {
    paddingBottom: responsiveVerticalSize(8),
  },
  containerContinuar: {
    width: "77%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textContinuar: {
    flex: 1,
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(16),
    color: COLORS.back,
    letterSpacing: 0.5,
    textAlign: "right",
    marginRight: responsiveSpacing(6),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalContainer: {
    minHeight: responsiveVerticalSize(145),
    width: "100%",
    backgroundColor: COLORS.greenM,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: responsiveSize(5),
    borderTopLeftRadius: responsiveSize(5),
    paddingHorizontal: responsiveSpacing(25),
    paddingBottom: responsiveVerticalSize(12),
  },
});
