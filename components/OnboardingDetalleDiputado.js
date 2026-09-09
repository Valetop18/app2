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

const PeliculaConVentana = ({
    objetivo,
    margen = responsiveWidthScale(9),
}) => {
    const { width, height } = useWindowDimensions();

    if (!objetivo) {
        return <View style={styles.peliculaCompleta} />;
    }

    const izquierda = Math.max(objetivo.x - margen, 0);
    const arriba = Math.max(objetivo.y - margen, 0);

    const ancho = Math.min(
        objetivo.width + margen * 2,
        width - izquierda,
    );

    const alto = Math.min(
        objetivo.height + margen * 2,
        height - arriba,
    );

    return (
        <>
            <View
                style={[
                    styles.pelicula,
                    {
                        top: 0,
                        left: 0,
                        width,
                        height: arriba,
                    },
                ]}
            />

            <View
                style={[
                    styles.pelicula,
                    {
                        top: arriba,
                        left: 0,
                        width: izquierda,
                        height: alto,
                    },
                ]}
            />

            <View
                style={[
                    styles.pelicula,
                    {
                        top: arriba,
                        left: izquierda + ancho,
                        right: 0,
                        height: alto,
                    },
                ]}
            />

            <View
                style={[
                    styles.pelicula,
                    {
                        top: arriba + alto,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    },
                ]}
            />
        </>
    );
};

const OnboardingDetalleDiputado = ({
    visible,
    pasoActual,
    informacionPrincipal,
    ultimasVotaciones,
    animacionPulso,
    onPressSenadores,
    onOmitir,
}) => {
    const { width, height } = useWindowDimensions();

    if (!visible) return null;

    const pasoInformacion = pasoActual === 3;
    const pasoVotaciones = pasoActual === 4;
    const pasoSenadores = pasoActual === 5;

    const anchoTab = width / 3;

    const tabSenadores = {
        x: anchoTab,
        y: height - responsiveHeightScale(72),
        width: anchoTab,
        height: responsiveHeightScale(72),
    };

    const escalaPulso = animacionPulso.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.18],
    });

    const opacidadPulso = animacionPulso.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1],
    });

    const objetivo = pasoInformacion
        ? informacionPrincipal
        : pasoVotaciones
            ? ultimasVotaciones
            : tabSenadores;

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
                <PeliculaConVentana objetivo={objetivo} />

                {pasoInformacion && (
                    <View style={styles.mensajeInformacion}>
                        <MaterialIcons
                            name="keyboard-double-arrow-up"
                            size={responsiveWidthScale(38)}
                            color={COLORS.greenM}
                        />

                        <Text style={styles.textoPrincipal}>
                            Estadísticas e información{"\n"}
                            del representante
                        </Text>
                    </View>
                )}

                {pasoVotaciones && (
                    <View
                        style={[
                            styles.mensajeVotaciones,
                            ultimasVotaciones && {
                                top:
                                    ultimasVotaciones.y -
                                    responsiveHeightScale(100),
                            },
                        ]}
                    >
                        <Text style={styles.textoPrincipal}>
                            Revisa sus últimas votaciones
                        </Text>

                        <MaterialIcons
                            name="keyboard-double-arrow-down"
                            size={responsiveWidthScale(38)}
                            color={COLORS.greenM}
                        />
                    </View>
                )}

                {pasoSenadores && (
                    <>
                        <View style={styles.mensajeSenadores}>
                            <Text style={styles.textoPrincipal}>
                                Conoce también a tus senadores
                            </Text>
                        </View>

                        <Pressable
                            style={[
                                styles.zonaSenadores,
                                {
                                    left: tabSenadores.x,
                                    top: tabSenadores.y,
                                    width: tabSenadores.width,
                                    height: tabSenadores.height,
                                },
                            ]}
                            onPress={onPressSenadores}
                        />

                        <Animated.View
                            pointerEvents="none"
                            style={[
                                styles.manoSenadores,
                                {
                                    left:
                                        tabSenadores.x +
                                        tabSenadores.width / 2 -
                                        responsiveWidthScale(16),
                                    top:
                                        tabSenadores.y +
                                        tabSenadores.height / 2 -
                                        responsiveHeightScale(16),
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
                        styles.controles,
                        pasoInformacion
                            ? styles.controlesInferiores
                            : styles.controlesSuperiores,
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

    mensajeInformacion: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: responsiveHeightScale(135),
        alignItems: "center",
        zIndex: 4,
    },

    mensajeVotaciones: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 4,
    },

    mensajeSenadores: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: responsiveHeightScale(145),
        alignItems: "center",
        zIndex: 4,
    },

    textoPrincipal: {
        color: COLORS.black,
        fontFamily: FONTS.bold,
        fontSize: Math.max(11, responsiveWidthScale(18)),
        lineHeight: responsiveHeightScale(25),
        letterSpacing: responsiveWidthScale(1),
        textAlign: "center",
    },

    zonaSenadores: {
        position: "absolute",
        zIndex: 5,
    },

    manoSenadores: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 6,
    },

    controles: {
        position: "absolute",
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 7,
    },

    controlesInferiores: {
        bottom: responsiveHeightScale(76),
    },

    controlesSuperiores: {
        top: responsiveHeightScale(160),
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

export default OnboardingDetalleDiputado;