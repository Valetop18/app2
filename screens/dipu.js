import React from "react";
import GridRepresent from "../components/gridRepresents";
import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { COLORS } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { reaccionesRepository } from "../infrastructure/ReaccionesRepository";
import { legisladoresRepository } from "../infrastructure/legisladoresRepository";
import { useFocusEffect } from "@react-navigation/native";
import { Skeleton } from "../components/Skeleton";

export const Diputados = ({ navigation }) => {
  const { user } = useAuth();

  const [diputados, setDiputados] = useState([]);

  const [reacciones, setReacciones] = useState({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const handleSelected = (item) => {
    navigation.navigate("Descripcion", {
      idDiputado: item.id,
    });
  };

  const cargarLegisladores = async (distrito) => {
    //await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      //se podria agregar un spinner
      setLoading(true);
      const data =
        await legisladoresRepository.getDiputadosByDistrito(distrito);

      console.log("diputados distrito:", data);
      const dataRandom = data.sort(() => Math.random() - 0.5);
      setDiputados(dataRandom);
    } catch (error) {
    } finally {
      //desactivar spinner'
      setLoading(false);
    }
  };

  const loadReacciones = async () => {
    try {
      setIsRefreshing(true);

      const data = await reaccionesRepository.getReacciones(
        user.id,
        "representante",
      );

      const mapReacciones = {};

      (data ?? []).forEach((reaccion) => {
        mapReacciones[reaccion.target_id] = reaccion.tipo_reaccion;
      });

      setReacciones(mapReacciones);
    } catch (error) {
      console.error("Error al cargar reacciones:", error);
      setReacciones({});
    } finally {
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
  useCallback(() => {
    if (!user?.id || !user?.distrito) return;

    const actualizarPantalla = async () => {
      await Promise.all([
        loadReacciones(),
        cargarLegisladores(user.distrito),
      ]);
    };

    actualizarPantalla();
  }, [user?.id, user?.distrito]),
);

  const handleLike = async (id, tipoReaccion) => {
    try {
      const actual = reacciones[id];
      const nueva = actual === tipoReaccion ? "null" : tipoReaccion;

      await reaccionesRepository.setReaccion(
        user.id,
        id,
        "representante",
        nueva,
      );

      setReacciones((prev) => ({
        ...prev,
        [id]: nueva,
      }));

      setDiputados((prev) =>
        prev.map((dipu) => {
          if (dipu.id !== id) return dipu;

          let cambio = 0;

          if (actual !== "like" && nueva === "like") cambio = 1;
          if (actual === "like" && nueva !== "like") cambio = -1;

          return {
            ...dipu,
            totalLikes: Math.max((dipu.totalLikes ?? 0) + cambio, 0),
          };
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const renderGridItem = ({ item }) => {
    const reaccion = reacciones[item.id];

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
        paddingVertical: 18,
      }}
    >
      <Skeleton width={76} height={76} borderRadius={100} />
      <View style={{ marginHorizontal: 15 }}>
        <Skeleton width={250} height={25} borderRadius={4} />
        <View style={{ marginHorizontal: 5, marginTop: 12 }}>
          <Skeleton width={120} height={15} borderRadius={4} />
        </View>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.back}></View>
      {loading ? (
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
