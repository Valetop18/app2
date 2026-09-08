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
import Svg, {
    Circle,
    Defs,
    Mask,
    Rect,
} from "react-native-svg";

const TOTAL_PASOS = 10;
const COLOR_PELICULA = "rgba(255,255,255,0.80)";

const PeliculaConVentana = ({
    objetivo,
    margen = responsiveWidthScale(7),
}) => {
    const { width, height } = useWindowDimensions();

    if (!objetivo) {
        return <View style={styles.peliculaCompleta} />;
    }

    const radio =
        Math.max(objetivo.width, objetivo.height) / 2 +
        margen;

    const centroX = objetivo.x + objetivo.width / 2;
    const centroY = objetivo.y + objetivo.height / 2;

    return (
        <Svg
            pointerEvents="none"
            width={width}
            height={height}
            style={StyleSheet.absoluteFillObject}
        >
            <Defs>
                <Mask id="mascaraBurbuja">
                    <Rect
                        x="0"
                        y="0"
                        width={width}
                        height={height}
                        fill="white"
                    />

                    <Circle
                        cx={centroX}
                        cy={centroY}
                        r={radio}
                        fill="black"
                    />
                </Mask>
            </Defs>

            <Rect
                x="0"
                y="0"
                width={width}
                height={height}
                fill={COLOR_PELICULA}
                mask="url(#mascaraBurbuja)"
            />
        </Svg>
    );
};

const OnboardingCamaraDipu = ({
    visible,
    fase,
    pasoActual,
    hemiciclo,
    controles,
    burbuja,
    animacionPulso,
    onPressBurbuja,
    onOmitir,
}) => {
    if (!visible) return null;

    const esIntroduccion = fase === "introduccion";
    const esControles = fase === "controles";
    const esCalendario = fase === "calendario";
    const esBurbuja = fase === "burbuja";

    const escalaPulso = animacionPulso.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.18],
    });

    const opacidadPulso = animacionPulso.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1],
    });

    const objetivo = esBurbuja ? burbuja : null;

    const renderIndicadores = () => (
        <View style={styles.indicadores}>
            {Array.from({ length: TOTAL_PASOS }).map((_, index) => {
                const numeroPaso = index + 1;

                return (
                    <View
                        key={numeroPaso}
                        style={[
                            styles.indicador,
                            numeroPaso === pasoActual
                                ? styles.indicadorActivo
                                : styles.indicadorInactivo,
                        ]}
                    />
                );
            })}
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
                    <View style={styles.peliculaIntroduccion} />
                )}

                {esControles && (
                    <View
                        style={[
                            styles.peliculaTexto,
                            {
                                top: controles
                                    ? controles.y - responsiveHeightScale(100)
                                    : responsiveHeightScale(610),
                                height: responsiveHeightScale(92),
                            },
                        ]}
                    />
                )}

                {esCalendario && (
                    <>
                        <View
                            style={[
                                styles.peliculaTexto,
                                {
                                    top: responsiveHeightScale(62),
                                    height: responsiveHeightScale(133),
                                },
                            ]}
                        />

                        <View
                            style={[
                                styles.peliculaTexto,
                                {
                                    top: controles
                                        ? controles.y - responsiveHeightScale(105)
                                        : responsiveHeightScale(590),
                                    height: responsiveHeightScale(100),
                                },
                            ]}
                        />
                    </>
                )}

                {esBurbuja && (
                    <PeliculaConVentana
                        objetivo={burbuja}
                        margen={responsiveWidthScale(7)}
                    />
                )}

                {esIntroduccion && (
                    <View style={styles.mensajeIntroduccion}>
                        <MaterialIcons
                            name="keyboard-double-arrow-up"
                            size={responsiveWidthScale(34)}
                            color={COLORS.greenM}
                        />

                        <Text style={styles.textoPrincipal}>
                            La animación mostrará los datos{"\n"}
                            de la última sesión de la cámara{"\n"}
                            que selecciones
                        </Text>
                    </View>
                )}

                {esControles && (
                    <View
                        style={[
                            styles.mensajeControles,
                            controles && {
                                top:
                                    controles.y -
                                    responsiveHeightScale(88),
                            },
                        ]}
                    >
                        <Text style={styles.textoPrincipal}>
                            Puedes controlar la animación{"\n"}
                            desde este menú
                        </Text>

                        <MaterialIcons
                            name="keyboard-double-arrow-down"
                            size={responsiveWidthScale(34)}
                            color={COLORS.greenM}
                        />
                    </View>
                )}

                {esCalendario && (
                    <>
                        <View style={styles.mensajeAcumulado}>
                            <Text style={styles.textoPrincipal}>
                                Al terminar la animación verás{"\n"}
                                los datos acumulados
                            </Text>

                            <MaterialIcons
                                name="keyboard-double-arrow-down"
                                size={responsiveWidthScale(34)}
                                color={COLORS.greenM}
                            />
                        </View>

                        <View
                            style={[
                                styles.mensajeCalendario,
                                controles && {
                                    top:
                                        controles.y -
                                        responsiveHeightScale(92),
                                },
                            ]}
                        >
                            <Text style={styles.textoSecundario}>
                                Aquí puedes seleccionar sesiones anteriores{"\n"}
                                para revisar los datos de la Cámara
                            </Text>

                            <MaterialIcons
                                name="keyboard-double-arrow-down"
                                size={responsiveWidthScale(34)}
                                color={COLORS.greenM}
                            />
                        </View>
                    </>
                )}

                {esBurbuja && burbuja && (
                    <>
                        <View
                            style={[
                                styles.mensajeBurbuja,
                                {
                                    top:
                                        burbuja.y +
                                        burbuja.height +
                                        responsiveHeightScale(38),
                                },
                            ]}
                        >
                            <Text style={styles.textoPrincipal}>
                                Toca una burbuja para ver el detalle{"\n"}
                                de asistencia, votaciones o proyectos
                            </Text>
                        </View>

                        <Pressable
                            style={[
                                styles.zonaBurbuja,
                                {
                                    left: burbuja.x,
                                    top: burbuja.y,
                                    width: burbuja.width,
                                    height: burbuja.height,
                                },
                            ]}
                            onPress={onPressBurbuja}
                        />

                        <Animated.View
                            pointerEvents="none"
                            style={[
                                styles.manoBurbuja,
                                {
                                    left:
                                        burbuja.x +
                                        burbuja.width / 2 -
                                        responsiveWidthScale(8),
                                    top:
                                        burbuja.y +
                                        burbuja.height / 2 -
                                        responsiveHeightScale(5),
                                    opacity: opacidadPulso,
                                    transform: [{ scale: escalaPulso }],
                                },
                            ]}
                        >
                            <MaterialIcons
                                name="touch-app"
                                size={responsiveWidthScale(32)}
                                color={COLORS.greenM}
                            />
                        </Animated.View>
                    </>
                )}

                <View
                    style={[
                        styles.controlesOnboarding,
                        esBurbuja && styles.controlesOnboardingBurbuja,
                    ]}
                >
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

    peliculaCompleta: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLOR_PELICULA,
        zIndex: 1,
    },

    peliculaIntroduccion: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "25%",
        backgroundColor: COLOR_PELICULA,
        zIndex: 1,
    },
    peliculaTexto: {
        position: "absolute",
        left: 0,
        right: 0,
        backgroundColor: COLOR_PELICULA,
        zIndex: 1,
    },
    mensajeIntroduccion: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: responsiveHeightScale(115),
        alignItems: "center",
        zIndex: 4,
    },

    mensajeControles: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 4,
    },

    mensajeAcumulado: {
        position: "absolute",
        top: responsiveHeightScale(105),
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 4,
    },

    mensajeCalendario: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 4,
    },

    mensajeBurbuja: {
        position: "absolute",
        left: responsiveWidthScale(20),
        right: responsiveWidthScale(20),
        alignItems: "center",
        zIndex: 4,
    },

    textoPrincipal: {
        color: COLORS.black,
        fontFamily: FONTS.bold,
        fontSize: Math.max(11, responsiveWidthScale(17)),
        lineHeight: responsiveHeightScale(23),
        letterSpacing: responsiveWidthScale(1),
        textAlign: "center",
    },

    textoSecundario: {
        color: COLORS.black,
        fontFamily: FONTS.bold,
        fontSize: Math.max(11, responsiveWidthScale(15.5)),
        lineHeight: responsiveHeightScale(22),
        letterSpacing: responsiveWidthScale(0.8),
        textAlign: "center",
    },

    zonaBurbuja: {
        position: "absolute",
        zIndex: 5,
    },

    manoBurbuja: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 6,
    },

    controlesOnboarding: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: responsiveHeightScale(35),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 7,
    },

    controlesOnboardingBurbuja: {
        bottom: responsiveHeightScale(58),
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
        marginLeft: responsiveWidthScale(18),

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

export default OnboardingCamaraDipu;