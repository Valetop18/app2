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

export const PartidoUsuario = () => {
  const navigation = useNavigation();
  const { user, setTipoAuth } = useAuth();
  const [partidoSeleccionado, setPartidoSeleccionado] = useState("");
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
    const onPress = () => setPartidoSeleccionado(item.id);
    const isSelected = item.id === partidoSeleccionado;

    return (
      <TouchableOpacity onPress={onPress}>
        <Partido item={item} selected={isSelected} />
      </TouchableOpacity>
    );
  };

  const handleContinuar = async () => {
    try {
      await partidosRepository.savePartidoUsuario(user.id, partidoSeleccionado);
      setTipoAuth("");
      //navigation.navigate("SelectDistrito");
    } catch (error) {
      console.error(error);
    }
  };

  const skeletonCard = () => (
    <View
      style={{
        alignSelf: "flex-start",
        paddingVertical: 8,
      }}
    >
      <Skeleton width={300} height={15} borderRadius={5} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.conteinerTitulo}>
        <Text style={styles.subTitulo}>
          Solo si te sientes parte, si no omítelo,
        </Text>
        <Text style={styles.titulo}>Selecciona un partido:</Text>
        <View marginTop={"3%"}>
          {loading ? (
            <FlatList
              style={styles.flatlist}
              data={[1, 2, 3, 4, 5]}
              renderItem={skeletonCard}
              numColumns={1}
              keyExtractor={(item) => item.toString()}
            />
          ) : (
            <FlatList
              style={styles.flatlist}
              data={partidos}
              renderItem={renderGridItem}
              numColumns={1}
              keyExtractor={(item) => item.id}
            />
          )}
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
    alignItems: "flex-end",
    marginTop: "15%",
  },
});
