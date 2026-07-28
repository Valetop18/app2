import React from "react";
import GridRepresent from "../components/gridRepresents";
import { FlatList, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useReacciones } from "../context/ReaccionesContext";
import { useCallback } from "react";
import { useData } from "../context/DataContext";
import { useFocusEffect } from "@react-navigation/native";
import { Skeleton } from "../components/Skeleton";
import { responsiveSize, responsiveSpacing } from "../utils/responsive";

export const Diputados = ({ navigation }) => {
  const { user } = useAuth();

  const { reaccionesRepresentante, setReaccionRepresentante } = useReacciones();

  const { diputados, loadingDiputados, cargarDiputados, actualizarDiputado } =
    useData();

  const handleSelected = (item) => {
    navigation.navigate("Descripcion", {
      idDiputado: item.id,
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (!user?.distrito) return;

      cargarDiputados(user.distrito);
    }, [user?.distrito, cargarDiputados]),
  );

  const handleLike = async (id, tipoReaccion) => {
    try {
      const resultado = await setReaccionRepresentante(id, tipoReaccion);

      if (!resultado) return;

      const { anterior, nueva } = resultado;

      actualizarDiputado(id, (dipu) => {
        let cambio = 0;

        if (anterior !== "like" && nueva === "like") cambio = 1;
        if (anterior === "like" && nueva !== "like") cambio = -1;

        return {
          totalLikes: Math.max((dipu.totalLikes ?? 0) + cambio, 0),
        };
      });
    } catch (error) {
      console.log("Error al reaccionar al diputado:", error);
    }
  };

  const renderGridItem = ({ item }) => {
    const reaccion = reaccionesRepresentante[item.id];

    return (
      <GridRepresent
        item={item}
        reaccion={reaccion}
        onSelected={handleSelected}
        handleLike={handleLike}
      />
    );
  };

  const skeletonCard = () => (
    <View
      style={{
        flexDirection: "row",
        width: "90%",
        alignSelf: "center",
        paddingVertical: responsiveSpacing(18),
      }}
    >
      <Skeleton
        width={responsiveSize(76)}
        height={responsiveSize(76)}
        borderRadius={responsiveSize(100)}
      />

      <View
        style={{
          marginHorizontal: responsiveSpacing(15),
          flex: 1,
        }}
      >
        <Skeleton
          width="100%"
          height={responsiveSize(25)}
          borderRadius={responsiveSize(4)}
        />

        <View
          style={{
            marginHorizontal: responsiveSpacing(5),
            marginTop: responsiveSpacing(12),
          }}
        >
          <Skeleton
            width={responsiveSize(120)}
            height={responsiveSize(15)}
            borderRadius={responsiveSize(4)}
          />
        </View>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.back}></View>
      {loadingDiputados ? (
        <FlatList
          style={styles.container}
          data={[1, 2, 3]}
          renderItem={skeletonCard}
          numColumns={1}
          keyExtractor={(item) => item.toString()}
        />
      ) : (
        <FlatList
          style={styles.container}
          data={diputados}
          renderItem={renderGridItem}
          numColumns={1}
          keyExtractor={(item) => item.id}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  back: {
    backgroundColor: COLORS.back,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  container: {
    marginTop: 5,
  },
});
