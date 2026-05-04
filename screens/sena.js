import React from "react";
import GridRepresent from "../components/gridRepresents";
import { useSelector } from "react-redux";
import { FlatList, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { reaccionesRepository } from "../infrastructure/ReaccionesRepository";
import { legisladoresRepository } from "../infrastructure/legisladoresRepository";
import { useFocusEffect } from "@react-navigation/native";
import { Skeleton } from "../components/Skeleton";

export const Senadores = ({ navigation }) => {
  const { user } = useAuth();

  console.log("user: ", user);

  const [senadores, setSenadores] = useState([]);

  const [reacciones, setReacciones] = useState({});
  const [loading, setLoading] = useState(true);

  const handleSelected = (item) => {
    navigation.navigate("DescripcionSenador", {
      idSenador: item.id,
    });
  };

  useEffect(() => {
    if (user?.circunscripcion) {
      cargarSenadores(user.circunscripcion);
    }
  }, []);

  const cargarSenadores = async (circunscripcion) => {
    try {
      //se podria agregar un spinner
      setLoading(true);
      console.log("circunscripcion: ", circunscripcion);
      const data =
        await legisladoresRepository.getSenadoresByCircunscripcion(
          circunscripcion,
        );
      const dataRandom = data.sort(() => Math.random() - 0.5);
      setSenadores(dataRandom);
      console.log("senadores: ");
      console.log(data);
    } catch (error) {
    } finally {
      setLoading(false);
      //desactivar spinner
    }
  };

  const loadReacciones = async () => {
    const data = await reaccionesRepository.getReacciones(
      user.id,
      "representante",
    );

    if (data) {
      const mapReacciones = {};
      data.forEach((r) => {
        mapReacciones[r.target_id] = r.tipo_reaccion;
      });
      setReacciones(mapReacciones);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReacciones();
    }, []),
  );

  const handleLike = (id, tipoReaccion) => {
    try {
      const actual = reacciones[id];

      const nueva = actual === tipoReaccion ? "null" : tipoReaccion;

      console.log("intento reaccion");

      const resultado = reaccionesRepository.setReaccion(
        user.id,
        id,
        "representante",
        nueva,
      );

      setReacciones((prev) => ({
        ...prev,
        [id]: nueva,
      }));
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
          data={senadores}
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
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    marginTop: 5, //StatusBar.currentHeight || 0,
  },
});
