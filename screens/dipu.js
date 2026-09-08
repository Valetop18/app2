import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import GridRepresent from "../components/gridRepresents";
import OnboardingDiputados from "../components/OnboardingDiputados";
import { Skeleton } from "../components/Skeleton";
import { COLORS } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useReacciones } from "../context/ReaccionesContext";
import { useData } from "../context/DataContext";
import { useOnboarding } from "../context/OnboardingContext";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";

export const Diputados = ({ navigation }) => {
  const { user } = useAuth();

  const {
    activo,
    pasoActual,
    cargandoOnboarding,
    avanzarPaso,
    irAlPaso,
    omitirRecorrido,
  } = useOnboarding();

  const {
    reaccionesRepresentante,
    setReaccionRepresentante,
  } = useReacciones();

  const {
    diputados,
    loadingDiputados,
    cargarDiputados,
    obtenerDiputado,
    totalesLikesRepresentantes,
    actualizarTotalLikesRepresentante,
  } = useData();

  const primeraTarjetaRef = useRef(null);
  const temporizadorIntroduccionRef = useRef(null);
  const temporizadorSeleccionRef = useRef(null);
  const animacionPulsoRef = useRef(null);
  const navegandoRef = useRef(false);

  const escalaTarjeta = useRef(new Animated.Value(1)).current;
  const animacionPulso = useRef(new Animated.Value(0)).current;

  const MODO_DISENO = false;

  const [tarjeta, setTarjeta] = useState(null);

  const datosListos =
    !loadingDiputados &&
    diputados.length > 0;

  const onboardingVisible =
    activo &&
    !cargandoOnboarding &&
    datosListos &&
    (pasoActual === 1 || pasoActual === 2);

  const handleSelected = useCallback(
    (item) => {
      navigation.navigate("Descripcion", {
        idDiputado: item.id,
      });
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      if (!user?.distrito) return;

      cargarDiputados(user.distrito);
    }, [user?.distrito, cargarDiputados]),
  );

  const detenerTemporizadores = useCallback(() => {
    if (temporizadorIntroduccionRef.current) {
      clearTimeout(temporizadorIntroduccionRef.current);
      temporizadorIntroduccionRef.current = null;
    }

    if (temporizadorSeleccionRef.current) {
      clearTimeout(temporizadorSeleccionRef.current);
      temporizadorSeleccionRef.current = null;
    }
  }, []);

  const detenerPulso = useCallback(() => {
    if (animacionPulsoRef.current) {
      animacionPulsoRef.current.stop();
      animacionPulsoRef.current = null;
    }

    animacionPulso.stopAnimation();
    animacionPulso.setValue(0);
  }, [animacionPulso]);

  const medirPrimeraTarjeta = useCallback(
    (alTerminar) => {
      requestAnimationFrame(() => {
        primeraTarjetaRef.current?.measureInWindow(
          (x, y, width, height) => {
            if (width <= 0 || height <= 0) return;

            const medidas = {
              x,
              y,
              width,
              height,
            };

            setTarjeta(medidas);
            alTerminar?.(medidas);
          },
        );
      });
    },
    [],
  );

  const mostrarSeleccionRepresentante = useCallback(() => {
    if (pasoActual !== 1 || navegandoRef.current) return;

    if (temporizadorIntroduccionRef.current) {
      clearTimeout(temporizadorIntroduccionRef.current);
      temporizadorIntroduccionRef.current = null;
    }

    if (tarjeta) {
      irAlPaso(2);
      return;
    }

    medirPrimeraTarjeta((medidas) => {
      if (medidas) {
        irAlPaso(2);
      }
    });
  }, [
    pasoActual,
    tarjeta,
    irAlPaso,
    medirPrimeraTarjeta,
  ]);

  const ejecutarSeleccionRepresentante = useCallback(() => {
    if (
      navegandoRef.current ||
      pasoActual !== 2 ||
      !diputados[0]
    ) {
      return;
    }

    navegandoRef.current = true;

    detenerTemporizadores();
    detenerPulso();

    Animated.sequence([
      Animated.timing(escalaTarjeta, {
        toValue: 0.97,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(escalaTarjeta, {
        toValue: 1,
        duration: 110,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        navegandoRef.current = false;
        return;
      }

      avanzarPaso();
      handleSelected(diputados[0]);
    });
  }, [
    pasoActual,
    diputados,
    detenerTemporizadores,
    detenerPulso,
    escalaTarjeta,
    avanzarPaso,
    handleSelected,
  ]);

  const handleOmitir = useCallback(async () => {
    if (navegandoRef.current) return;

    navegandoRef.current = true;

    detenerTemporizadores();
    detenerPulso();
    escalaTarjeta.setValue(1);

    await omitirRecorrido();

    navegandoRef.current = false;
  }, [
    detenerTemporizadores,
    detenerPulso,
    escalaTarjeta,
    omitirRecorrido,
  ]);

  useEffect(() => {
    if (!onboardingVisible) return;

    navegandoRef.current = false;

    const temporizadorMedicion = setTimeout(() => {
      medirPrimeraTarjeta();
    }, 100);

    return () => {
      clearTimeout(temporizadorMedicion);
    };
  }, [onboardingVisible, medirPrimeraTarjeta]);

  useEffect(() => {
    if (!onboardingVisible || pasoActual !== 1) return;

    detenerTemporizadores();

    temporizadorIntroduccionRef.current = setTimeout(() => {
      mostrarSeleccionRepresentante();
    }, MODO_DISENO ? 0 : 4000);

    return () => {
      if (temporizadorIntroduccionRef.current) {
        clearTimeout(temporizadorIntroduccionRef.current);
        temporizadorIntroduccionRef.current = null;
      }
    };
  }, [
    onboardingVisible,
    pasoActual,
    detenerTemporizadores,
    mostrarSeleccionRepresentante,
  ]);

  useEffect(() => {
    if (
      !onboardingVisible ||
      pasoActual !== 2 ||
      !tarjeta
    ) {
      detenerPulso();
      return;
    }

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

    if (!MODO_DISENO) {
      temporizadorSeleccionRef.current = setTimeout(() => {
        ejecutarSeleccionRepresentante();
      }, 4000);
    }

    return () => {
      if (temporizadorSeleccionRef.current) {
        clearTimeout(temporizadorSeleccionRef.current);
        temporizadorSeleccionRef.current = null;
      }

      detenerPulso();
    };
  }, [
    onboardingVisible,
    pasoActual,
    tarjeta,
    animacionPulso,
    detenerPulso,
    ejecutarSeleccionRepresentante,
  ]);

  useEffect(() => {
    return () => {
      detenerTemporizadores();
      detenerPulso();
    };
  }, [detenerTemporizadores, detenerPulso]);

  const handleLike = async (id, tipoReaccion) => {
    try {
      const resultado = await setReaccionRepresentante(
        id,
        tipoReaccion,
      );

      if (!resultado) return;

      const { anterior, nueva } = resultado;

      let cambio = 0;

      if (anterior !== "like" && nueva === "like") cambio = 1;
      if (anterior === "like" && nueva !== "like") cambio = -1;

      const diputadoActual = obtenerDiputado(id);

      const totalActual =
        totalesLikesRepresentantes[id] ??
        diputadoActual?.totalLikes ??
        0;

      const nuevoTotal = Math.max(
        Number(totalActual) + cambio,
        0,
      );

      actualizarTotalLikesRepresentante(id, nuevoTotal);
    } catch (error) {
      console.log("Error al reaccionar al diputado:", error);
    }
  };

  const renderGridItem = ({ item, index }) => {
    const reaccion = reaccionesRepresentante[item.id];
    const esPrimeraTarjeta = index === 0;

    return (
      <GridRepresent
        item={item}
        reaccion={reaccion}
        onSelected={handleSelected}
        handleLike={handleLike}
        cardRef={
          esPrimeraTarjeta
            ? primeraTarjetaRef
            : undefined
        }
        escalaOnboarding={
          esPrimeraTarjeta
            ? escalaTarjeta
            : 1
        }
        bloquearLike={
          onboardingVisible && esPrimeraTarjeta
        }
      />
    );
  };

  const skeletonCard = () => (
    <View style={styles.skeletonCard}>
      <Skeleton
        width={responsiveWidthScale(76)}
        height={responsiveWidthScale(76)}
        borderRadius={responsiveWidthScale(100)}
      />

      <View style={styles.skeletonInformacion}>
        <Skeleton
          width="100%"
          height={responsiveHeightScale(25)}
          borderRadius={responsiveWidthScale(4)}
        />

        <View style={styles.skeletonLinea}>
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
      <View style={styles.back} />

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
          keyExtractor={(item) => String(item.id)}
          extraData={`${activo}-${pasoActual}`}
          onContentSizeChange={() => {
            if (onboardingVisible) {
              medirPrimeraTarjeta();
            }
          }}
        />
      )}

      <OnboardingDiputados
        visible={onboardingVisible}
        pasoActual={pasoActual}
        tarjeta={tarjeta}
        animacionPulso={animacionPulso}
        onAvanzarIntroduccion={
          mostrarSeleccionRepresentante
        }
        onPressTarjeta={
          ejecutarSeleccionRepresentante
        }
        onOmitir={handleOmitir}
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

  skeletonCard: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    paddingVertical: responsiveHeightScale(18),
  },

  skeletonInformacion: {
    marginHorizontal: responsiveWidthScale(15),
    flex: 1,
  },

  skeletonLinea: {
    marginHorizontal: responsiveWidthScale(5),
    marginTop: responsiveHeightScale(12),
  },
});