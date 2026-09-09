import React from "react";
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import {
    responsiveHeightScale,
    responsiveWidthScale,
} from "../utils/responsive";

const TOTAL_PASOS = 10;
const COLOR_PELICULA = "rgba(255,255,255,0.80)";

const OnboardingDiputados = ({
    visible,
    pasoActual,
    tarjeta,
    animacionPulso,
    onAvanzarIntroduccion,
    onPressTarjeta,
    onOmitir,
}) => {
    const { width, height } = useWindowDimensions();

    if (!visible) return null;

    const esIntroduccion = pasoActual === 1;
    const esSeleccionRepresentante = pasoActual === 2;

    const x = tarjeta?.x ?? 0;
    const y = tarjeta?.y ?? 0;
    const cardWidth = tarjeta?.width ?? 0;
    const cardHeight = tarjeta?.height ?? 0;

    const escalaPulso = animacionPulso.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.18],
    });

    const opacidadPulso = animacionPulso.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1],
    });

    const margenDestacado = responsiveWidthScale(9);

    const destacadoX = Math.max(x - margenDestacado, 0);
    const destacadoY = Math.max(y - margenDestacado, 0);

    const destacadoWidth = Math.min(
        cardWidth + margenDestacado * 2,
        width - destacadoX,
    );

    const destacadoHeight =
        cardHeight + margenDestacado * 2;

    const renderIndicadores = () => (
        <View style={styles.indicadores}>
            {Array.from({ length: TOTAL_PASOS }).map((_, index) => {
                const numeroPaso = index + 1;
                const activo = numeroPaso === pasoActual;

                return (
                    <View
                        key={numeroPaso}
                        style={[
                            styles.indicador,
                            activo
                                ? styles.indicadorActivo
                                : styles.indicadorInactivo,
                        ]}
                    />
                );
            })}
        </View>
    );

    const renderContenidoInferior = () => (
        <View style={styles.contenidoInferior}>
            <Pressable
                style={styles.mensajePrincipal}
                onPress={
                    esIntroduccion
                        ? onAvanzarIntroduccion
                        : undefined
                }
            >
                <MaterialIcons
                    name="keyboard-double-arrow-up"
                    size={responsiveWidthScale(38)}
                    color={COLORS.greenM}
                />

                <Text style={styles.textoPrincipal}>
                    Aquí podrás ver los representantes{"\n"}
                    de tu distrito
                </Text>
            </Pressable>

            <View style={styles.filaInferior}>
                {renderIndicadores()}

                <Pressable
                    style={({ pressed }) => [
                        styles.botonOmitir,
                        pressed && styles.botonOmitirPresionado,
                    ]}
                    onPress={onOmitir}
                >
                    <Text style={styles.textoOmitir}>OMITIR</Text>
                </Pressable>
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            presentationStyle="overFullScreen"
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={onOmitir}
        >
            <View style={styles.modal}>
                {esIntroduccion && (
                    <>
                        <View
                            style={[
                                styles.peliculaIntroduccion,
                                {
                                    top: height * 0.71,
                                },
                            ]}
                        />

                        <Pressable
                            style={[
                                StyleSheet.absoluteFill,
                                styles.zonaAvanceIntroduccion,
                            ]}
                            onPress={onAvanzarIntroduccion}
                        />
                    </>
                )}

                {esSeleccionRepresentante && tarjeta && (
                    <>
                        {/* Película ubicada alrededor de la tarjeta destacada */}

                        <View
                            style={[
                                styles.pelicula,
                                {
                                    top: 0,
                                    left: 0,
                                    width,
                                    height: destacadoY,
                                },
                            ]}
                        />

                        {/* Película izquierda */}
                        <View
                            style={[
                                styles.pelicula,
                                {
                                    top: destacadoY,
                                    left: 0,
                                    width: destacadoX,
                                    height: destacadoHeight,
                                },
                            ]}
                        />

                        {/* Película derecha */}
                        <View
                            style={[
                                styles.pelicula,
                                {
                                    top: destacadoY,
                                    left: destacadoX + destacadoWidth,
                                    right: 0,
                                    height: destacadoHeight,
                                },
                            ]}
                        />

                        {/* Película inferior */}
                        <View
                            style={[
                                styles.pelicula,
                                {
                                    top: destacadoY + destacadoHeight,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                },
                            ]}
                        />

                        {/* Zona transparente que representa el toque de la tarjeta */}

                        <Pressable
                            style={[
                                styles.zonaTarjeta,
                                {
                                    top: y,
                                    left: x,
                                    width: cardWidth,
                                    height: cardHeight,
                                },
                            ]}
                            onPress={onPressTarjeta}
                        />

                        {/* Indicador animado de toque */}

                        <Animated.View
                            pointerEvents="none"
                            style={[
                                styles.indicadorToque,
                                {
                                    top:
                                        y +
                                        cardHeight -
                                        responsiveHeightScale(9),
                                    left:
                                        x +
                                        cardWidth * 0.62,
                                    opacity: opacidadPulso,
                                    transform: [{ scale: escalaPulso }],
                                },
                            ]}
                        >
                            <MaterialIcons
                                name="touch-app"
                                size={responsiveWidthScale(34)}
                                color={COLORS.greenM}
                            />
                        </Animated.View>

                        <View
                            pointerEvents="none"
                            style={[
                                styles.mensajeDetalle,
                                {
                                    top:
                                        y +
                                        cardHeight +
                                        responsiveHeightScale(28),
                                },
                            ]}
                        >
                            <Text style={styles.textoDetalle}>
                                Toca un representante para ver{"\n"}
                                su actividad y estadísticas
                            </Text>
                        </View>
                    </>
                )}

                {renderContenidoInferior()}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
    },

    pelicula: {
        position: "absolute",
        backgroundColor: COLOR_PELICULA,
        zIndex: 1,
    },

    peliculaIntroduccion: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLOR_PELICULA,
        zIndex: 1,
    },

    zonaAvanceIntroduccion: {
        zIndex: 2,
    },

    zonaTarjeta: {
        position: "absolute",
        zIndex: 4,
    },

    indicadorToque: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 6,
    },

    mensajeDetalle: {
        position: "absolute",
        right: responsiveWidthScale(17),
        width: "69%",
        zIndex: 5,
    },

    textoDetalle: {
        color: COLORS.black,
        fontFamily: FONTS.bold,
        fontSize: Math.max(11, responsiveWidthScale(16)),
        lineHeight: responsiveHeightScale(22),
        letterSpacing: responsiveWidthScale(1),
        textAlign: "center",
    },

    contenidoInferior: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: responsiveHeightScale(75),
        alignItems: "center",
        zIndex: 7,
    },

    mensajePrincipal: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    textoPrincipal: {
        marginTop: responsiveHeightScale(13),
        color: COLORS.black,
        fontFamily: FONTS.bold,
        fontSize: Math.max(11, responsiveWidthScale(19)),
        lineHeight: responsiveHeightScale(26),
        letterSpacing: responsiveWidthScale(1),
        textAlign: "center",
    },

    filaInferior: {
        width: "73%",
        marginTop: responsiveHeightScale(17),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    indicadores: {
        flexDirection: "row",
        alignItems: "center",
    },

    indicador: {
        width: responsiveWidthScale(11),
        height: responsiveWidthScale(11),
        borderRadius: responsiveWidthScale(6),
        marginRight: responsiveWidthScale(5),
    },

    indicadorActivo: {
        backgroundColor: COLORS.greenM,
    },

    indicadorInactivo: {
        backgroundColor: COLORS.verdeclaro,
    },

    botonOmitir: {
        minWidth: responsiveWidthScale(98),
        height: responsiveHeightScale(40),
        paddingHorizontal: responsiveWidthScale(18),
        borderRadius: responsiveWidthScale(22),
        backgroundColor: COLORS.greenM,
        justifyContent: "center",
        alignItems: "center",

        elevation: 6,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: responsiveHeightScale(4),
        },
        shadowOpacity: 0.24,
        shadowRadius: responsiveWidthScale(4),
    },

    botonOmitirPresionado: {
        opacity: 0.8,
        transform: [{ scale: 0.97 }],
    },

    textoOmitir: {
        color: COLORS.back,
        fontFamily: FONTS.bold,
        fontSize: Math.max(11, responsiveWidthScale(13)),
        letterSpacing: responsiveWidthScale(1),
    },
});

export default OnboardingDiputados;