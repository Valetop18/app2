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
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";
import { FONTS } from "../constants/fonts";

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
        paddingVertical: responsiveHeightScale(8),
        paddingHorizontal: responsiveWidthScale(8),
      }}
    >
      <Skeleton
        width={responsiveWidthScale(112)}
        height={responsiveHeightScale(35)}
        borderRadius={responsiveWidthScale(5)}
      />
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
            <TouchableOpacity
              style={styles.modalCerrar}
              onPress={() => setModalVisible(false)}
              hitSlop={8}
            >
              <MaterialIcons
                name="cancel"
                size={responsiveWidthScale(20)}
                color={COLORS.back}
              />
            </TouchableOpacity>

            <View style={styles.modalContenido}>
              <MsIcon
                icon={msCancel}
                size={responsiveWidthScale(36)}
                color={COLORS.back}
              />

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
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
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
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
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
            size={responsiveWidthScale(28)}
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
    marginTop: responsiveHeightScale(60),
    paddingVertical: responsiveHeightScale(20),
    paddingHorizontal: responsiveWidthScale(30),
  },

  subTitulo: {
    fontFamily: FONTS.medium,
    fontSize: Math.max(11, responsiveWidthScale(15)),
    color: COLORS.grey,
  },

  titulo: {
    fontFamily: FONTS.medium,
    fontSize: Math.max(11, responsiveWidthScale(20)),
    letterSpacing: responsiveWidthScale(1),
    color: COLORS.back,
  },

  containerFlatlist: {
    flexShrink: 1,
    alignItems: "center",
    paddingVertical: responsiveHeightScale(10),
    paddingHorizontal: responsiveWidthScale(5),
    justifyContent: "flex-start",
  },

  flatlist: {
    width: "100%",
  },

  flatlistContent: {
    paddingBottom: responsiveHeightScale(8),
  },

  topicoContainer: {
    alignSelf: "center",
    justifyContent: "center",
  },

  columnWrapper: {
    justifyContent: "center",
    alignItems: "center",
    gap: responsiveWidthScale(3),
  },

  containerFinal: {
    justifyContent: "flex-end",
    paddingTop: responsiveHeightScale(18),
    paddingBottom: responsiveHeightScale(48),
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
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(18)),
    color: COLORS.back,
    letterSpacing: responsiveWidthScale(0.5),
    textAlign: "right",
    marginRight: responsiveWidthScale(6),
    marginTop: responsiveHeightScale(-4),
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modalContainer: {
    height: responsiveHeightScale(145),
    width: "100%",
    backgroundColor: COLORS.greenM,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: responsiveWidthScale(5),
    borderTopLeftRadius: responsiveWidthScale(5),
    paddingHorizontal: responsiveWidthScale(25),
    paddingBottom: responsiveHeightScale(12),
  },

  modalCerrar: {
    position: "absolute",
    top: responsiveHeightScale(12),
    right: responsiveWidthScale(25),
    zIndex: 2,
  },

  modalContenido: {
    alignItems: "center",
    justifyContent: "center",
  },

  textModal: {
    fontFamily: FONTS.bold,
    color: COLORS.back,
    fontSize: Math.max(11, responsiveWidthScale(15)),
    marginTop: responsiveHeightScale(8),
    textAlign: "center",
  },
});
