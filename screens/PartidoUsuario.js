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
import { useState, useEffect } from "react";
import { partidosRepository } from "../infrastructure/partidosRepository";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "../components/Skeleton";
import {
  responsiveVerticalSize,
  responsiveSpacing,
  responsiveFont,
  responsiveIcon,
  responsiveSize,
} from "../utils/responsive";

export const PartidoUsuario = () => {
  const navigation = useNavigation();
  const { user, setTipoAuth } = useAuth();
  const [partidosSeleccionados, setPartidosSeleccionados] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPartidos();
  }, []);

  const cargarPartidos = async () => {
    try {
      const data = await partidosRepository.getPartidos();
      console.log(data);
      setPartidos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderGridItem = ({ item }) => {
    const isSelected = partidosSeleccionados.includes(item.id);

    const onPress = () => {
      setPartidosSeleccionados((seleccionActual) => {
        if (seleccionActual.includes(item.id)) {
          return seleccionActual.filter((partidoId) => partidoId !== item.id);
        }

        return [...seleccionActual, item.id];
      });
    };

    return (
      <TouchableOpacity onPress={onPress}>
        <Partido item={item} selected={isSelected} />
      </TouchableOpacity>
    );
  };

  const handleContinuar = async () => {
    try {
      if (partidosSeleccionados !== "") {
        await partidosRepository.savePartidoUsuario(
          user.id,
          partidosSeleccionados,
        );
      }

      setTipoAuth("");
      //navigation.navigate("SelectDistrito");
    } catch (error) {
      console.error(error);
    }
  };

  const skeletonCard = () => (
    <View style={styles.skeletonContainer}>
      <Skeleton
        width="85%"
        height={responsiveVerticalSize(15)}
        borderRadius={responsiveSize(5)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.conteinerTitulo}>
        <Text style={styles.subTitulo}>
          Solo si te sientes parte, si no omítelo,
        </Text>

        <Text style={styles.titulo}>Selecciona un partido:</Text>
      </View>

      <View style={styles.containerLista}>
        {loading ? (
          <FlatList
            style={styles.flatlist}
            contentContainerStyle={styles.flatlistContent}
            data={[1, 2, 3, 4, 5]}
            renderItem={skeletonCard}
            keyExtractor={(item) => item.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            style={styles.flatlist}
            contentContainerStyle={styles.flatlistContent}
            data={partidos}
            renderItem={renderGridItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View style={styles.containerFinal}>
        <TouchableOpacity
          style={styles.buttonIngresar}
          onPress={handleContinuar}
          activeOpacity={0.8}
        >
          <Text style={styles.boton}>Continuar</Text>

          <Ionicons
            name="chevron-forward-circle"
            size={responsiveIcon(30)}
            color={COLORS.back}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greenM,
    paddingTop: responsiveVerticalSize(78),
    paddingHorizontal: responsiveSpacing(20),
    paddingBottom: responsiveVerticalSize(28),
  },

  conteinerTitulo: {
    marginLeft: responsiveSpacing(17),
    paddingTop: responsiveVerticalSize(8),
  },

  titulo: {
    color: COLORS.back,
    fontSize: responsiveFont(20),
    letterSpacing: 1,
    fontFamily: "NotoSansMyanmar_700Bold",
    marginTop: responsiveVerticalSize(3),
  },

  subTitulo: {
    color: COLORS.grey,
    fontSize: responsiveFont(14),
    fontFamily: "NotoSansMyanmar_700Bold",
  },

  containerLista: {
    flex: 1,
    marginTop: responsiveVerticalSize(22),
    marginHorizontal: responsiveSpacing(15),
  },

  flatlist: {
    flex: 1,
    width: "100%",
  },
  flatlistContent: {
    paddingTop: 0,
    paddingBottom: responsiveVerticalSize(75),
  },
  skeletonContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingVertical: responsiveVerticalSize(8),
  },
  containerFinal: {
    position: "absolute",
    right: responsiveSpacing(38),
    bottom: responsiveVerticalSize(82),
  },
  buttonIngresar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    minHeight: responsiveVerticalSize(40),
  },
  boton: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(18),
    color: COLORS.back,
    marginRight: responsiveSpacing(6),
    letterSpacing: 1,
  },
});
