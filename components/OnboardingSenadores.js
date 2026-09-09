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

const OnboardingSenadores = ({
    visible,
    pasoActual,
    animacionPulso,
    onPressCamaras,
    onOmitir,
}) => {
    const { width, height } = useWindowDimensions();

    if (!visible) return null;

    const anchoTab = width / 3;

    const tabCamaras = {
        x: anchoTab * 2,
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
                <View
                    style={[
                        styles.pelicula,
                        {
                            top: 0,
                            left: 0,
                            right: 0,
                            height: tabCamaras.y,
                        },
                    ]}
                />

                <View
                    style={[
                        styles.pelicula,
                        {
                            top: tabCamaras.y,
                            left: 0,
                            width: tabCamaras.x,
                            bottom: 0,
                        },
                    ]}
                />

                <View style={styles.mensaje}>
                    <Text style={styles.textoPrincipal}>
                        Ahora revisemos las cámaras
                    </Text>
                </View>

                <Pressable
                    style={[
                        styles.zonaCamaras,
                        {
                            left: tabCamaras.x,
                            top: tabCamaras.y,
                            width: tabCamaras.width,
                            height: tabCamaras.height,
                        },
                    ]}
                    onPress={onPressCamaras}
                />

                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.manoCamaras,
                        {
                            left:
                                tabCamaras.x +
                                tabCamaras.width / 2 -
                                responsiveWidthScale(16),
                            top:
                                tabCamaras.y +
                                tabCamaras.height / 2 -
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

                <View style={styles.controles}>
                    <View style={styles.indicadores}>
                        {Array.from({ length: TOTAL_PASOS }).map(
                            (_, index) => {
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
                            },
                        )}
                    </View>

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

    mensaje: {
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

    zonaCamaras: {
        position: "absolute",
        zIndex: 5,
    },

    manoCamaras: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 6,
    },

    controles: {
        position: "absolute",
        top: responsiveHeightScale(160),
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 7,
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

export default OnboardingSenadores;