import React, {
  useCallback,
  useEffect,
  useRef,
} from "react";
import GridRepresent from "../components/gridRepresents";
import {
  Animated,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useReacciones } from "../context/ReaccionesContext";
import { useData } from "../context/DataContext";
import { useFocusEffect } from "@react-navigation/native";
import { Skeleton } from "../components/Skeleton";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";
import OnboardingSenadores from "../components/OnboardingSenadores";
import { useOnboarding } from "../context/OnboardingContext";

export const Senadores = ({ navigation }) => {
  const { user } = useAuth();

  const {
    activo,
    pasoActual,
    cargandoOnboarding,
    avanzarPaso,
    irAlPaso,
    omitirRecorrido,
  } = useOnboarding();

  const { reaccionesRepresentante, setReaccionRepresentante } = useReacciones();

  const {
    senadores,
    loadingSenadores,
    cargarSenadores,
    obtenerSenador,
    totalesLikesRepresentantes,
    actualizarTotalLikesRepresentante,
  } = useData();

  const animacionPulso = useRef(
    new Animated.Value(0),
  ).current;

  const animacionPulsoRef = useRef(null);
  const navegandoCamarasRef = useRef(false);

  const datosListos =
    !loadingSenadores &&
    senadores.length > 0;

  const navegarACamaras = useCallback(() => {
    if (
      navegandoCamarasRef.current ||
      pasoActual !== 7
    ) {
      return;
    }

    navegandoCamarasRef.current = true;

    if (animacionPulsoRef.current) {
      animacionPulsoRef.current.stop();
      animacionPulsoRef.current = null;
    }

    animacionPulso.stopAnimation();
    animacionPulso.setValue(0);

    avanzarPaso();

    navigation.getParent()?.navigate("Cámaras");
  }, [
    pasoActual,
    animacionPulso,
    avanzarPaso,
    navigation,
  ]);

  const handleSelected = (item) => {
    navigation.navigate("DescripcionSenador", {
      idSenador: item.id,
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (!user?.circunscripcion) return;

      cargarSenadores(user.circunscripcion);
    }, [user?.circunscripcion, cargarSenadores]),
  );

  useEffect(() => {
    if (
      !activo ||
      cargandoOnboarding ||
      !datosListos ||
      pasoActual !== 6
    ) {
      return;
    }

    const temporizadorCamaras = setTimeout(() => {
      irAlPaso(7);
    }, 2000);

    return () => {
      clearTimeout(temporizadorCamaras);
    };
  }, [
    activo,
    cargandoOnboarding,
    datosListos,
    pasoActual,
    irAlPaso,
  ]);

  useEffect(() => {
    if (
      !activo ||
      cargandoOnboarding ||
      !datosListos ||
      pasoActual !== 7
    ) {
      return;
    }

    navegandoCamarasRef.current = false;
    animacionPulso.setValue(0);

    animacionPulsoRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(animacionPulso, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animacionPulso, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.delay(350),
      ]),
    );

    animacionPulsoRef.current.start();

    const temporizadorNavegacion = setTimeout(() => {
      navegarACamaras();
    }, 2000);

    return () => {
      clearTimeout(temporizadorNavegacion);

      if (animacionPulsoRef.current) {
        animacionPulsoRef.current.stop();
        animacionPulsoRef.current = null;
      }

      animacionPulso.stopAnimation();
      animacionPulso.setValue(0);
    };
  }, [
    activo,
    cargandoOnboarding,
    datosListos,
    pasoActual,
    animacionPulso,
    navegarACamaras,
  ]);

  const handleLike = async (id, tipoReaccion) => {
    try {
      const resultado = await setReaccionRepresentante(id, tipoReaccion);

      if (!resultado) return;

      const { anterior, nueva } = resultado;

      let cambio = 0;

      if (anterior !== "like" && nueva === "like") cambio = 1;
      if (anterior === "like" && nueva !== "like") cambio = -1;

      const senadorActual = obtenerSenador(id);

      const totalActual =
        totalesLikesRepresentantes[id] ??
        senadorActual?.totalLikes ??
        0;

      const nuevoTotal = Math.max(Number(totalActual) + cambio, 0);

      actualizarTotalLikesRepresentante(id, nuevoTotal);
    } catch (error) {
      console.log("Error al reaccionar al senador:", error);
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
        paddingVertical: responsiveHeightScale(18),
      }}
    >
      <Skeleton
        width={responsiveWidthScale(76)}
        height={responsiveWidthScale(76)}
        borderRadius={responsiveWidthScale(100)}
      />

      <View
        style={{
          marginHorizontal: responsiveWidthScale(15),
          flex: 1,
        }}
      >
        <Skeleton
          width="100%"
          height={responsiveHeightScale(25)}
          borderRadius={responsiveWidthScale(4)}
        />

        <View
          style={{
            marginHorizontal: responsiveWidthScale(5),
            marginTop: responsiveHeightScale(12),
          }}
        >
          <Skeleton
            width={responsiveWidthScale(120)}
            height={responsiveHeightScale(15)}
            borderRadius={responsiveWidthScale(4)}
          />
        </View>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.back}></View>

      {loadingSenadores ? (
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
      <OnboardingSenadores
        visible={
          activo &&
          !cargandoOnboarding &&
          datosListos &&
          pasoActual === 7
        }
        pasoActual={pasoActual}
        animacionPulso={animacionPulso}
        onPressCamaras={navegarACamaras}
        onOmitir={omitirRecorrido}
      />
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
    marginTop: responsiveHeightScale(5),
  },
});