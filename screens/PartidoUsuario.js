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
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";
import { FONTS } from "../constants/fonts";

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

  const iconoContinuar = Math.min(
  responsiveWidthScale(30),
  responsiveHeightScale(30),
);

  const skeletonCard = () => (
    <View style={styles.skeletonContainer}>
      <Skeleton
        width="85%"
        height={responsiveHeightScale(15)}
        borderRadius={responsiveWidthScale(5)}
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
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            style={styles.flatlist}
            contentContainerStyle={styles.flatlistContent}
            data={partidos}
            renderItem={renderGridItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
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
            size={iconoContinuar}
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
    paddingTop: responsiveHeightScale(94),
    paddingHorizontal: responsiveWidthScale(20),
    paddingBottom: responsiveHeightScale(28),
  },

  conteinerTitulo: {
    marginLeft: responsiveWidthScale(17),
    paddingTop: responsiveHeightScale(8),
  },

  titulo: {
    color: COLORS.back,
    fontSize: Math.max(
      11,
      Math.min(
        responsiveWidthScale(20),
        responsiveHeightScale(20),
      ),
    ),
    letterSpacing: responsiveWidthScale(1),
    fontFamily: FONTS.bold,
    marginTop: responsiveHeightScale(3),
  },

  subTitulo: {
    color: COLORS.grey,
    fontSize: Math.max(
      11,
      Math.min(
        responsiveWidthScale(15),
        responsiveHeightScale(15),
      ),
    ),
    fontFamily: FONTS.bold,
  },

  containerLista: {
    flex: 1,
    marginTop: responsiveHeightScale(35),
    marginHorizontal: responsiveWidthScale(15),
  },

  flatlist: {
    flex: 1,
    width: "100%",
  },

  flatlistContent: {
    paddingTop: 0,
    paddingBottom: responsiveHeightScale(75),
  },

  skeletonContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingVertical: responsiveHeightScale(8),
  },

  containerFinal: {
    position: "absolute",
    right: responsiveWidthScale(38),
    bottom: responsiveHeightScale(82),
  },

  buttonIngresar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    minHeight: responsiveHeightScale(40),
  },

  boton: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(
      11,
      Math.min(
        responsiveWidthScale(20),
        responsiveHeightScale(20),
      ),
    ),
    color: COLORS.back,
    marginRight: responsiveWidthScale(6),
    letterSpacing: responsiveWidthScale(1),
    top: responsiveHeightScale(-4),
  },
});