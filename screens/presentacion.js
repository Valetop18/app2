import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Modal from "react-native-modal";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import {
  responsiveHeightScale,
  responsiveWidthScale,
} from "../utils/responsive";

const CORREO_NAWI = "nawiappchile@gmail.com";

export const Presentacion = () => {
  const [modalCorreoVisible, setModalCorreoVisible] =
    useState(false);

  const abrirCorreo = async () => {
    const url = `mailto:${CORREO_NAWI}`;

    try {
      const puedeAbrir = await Linking.canOpenURL(url);

      if (!puedeAbrir) {
        setModalCorreoVisible(true);
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      setModalCorreoVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={modalCorreoVisible}
        onBackdropPress={() => setModalCorreoVisible(false)}
        onBackButtonPress={() => setModalCorreoVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalCorreo}>
          <View style={styles.modalCerrarContainer}>
            <TouchableOpacity
              onPress={() => setModalCorreoVisible(false)}
              hitSlop={8}
            >
              <MaterialIcons
                name="cancel"
                size={responsiveWidthScale(20)}
                color={COLORS.grey}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContenido}>
            <MaterialIcons
              name="mail-outline"
              size={responsiveWidthScale(42)}
              color={COLORS.greenM}
            />

            <Text style={styles.textModal}>
              No hay una aplicación de correo disponible.
            </Text>

            <Text style={styles.correoModal}>
              Puedes escribirnos a {CORREO_NAWI}
            </Text>
          </View>
        </View>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contenido}
      >
        <Text style={styles.titulo}>
          Te damos la bienvenida a Nawi
        </Text>

        <Text style={styles.parrafo}>
          Esta aplicación nació para acercar a la ciudadanía a la
          actividad de sus representantes en el Congreso, ofreciendo
          información procesada de manera rápida y fácil.
        </Text>

        <Text style={styles.parrafo}>
          Ojalá la utilices y te resulte útil. Creemos que es
          importante para nuestra democracia contar con votantes
          informados y comprometidos, y este es nuestro granito de
          arena para contribuir a ello.
        </Text>

        <Text style={styles.parrafo}>
          Si tienes alguna duda, encuentras algún problema o quieres
          hacernos una sugerencia, estaremos felices de recibir tus
          comentarios en{" "}
          <Text style={styles.correo} onPress={abrirCorreo}>
            {CORREO_NAWI}
          </Text>
          .
        </Text>

        <Text style={styles.firma}>Equipo Nawi</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.back,
  },

  contenido: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidthScale(28),
    paddingTop: responsiveWidthScale(32),
    paddingBottom: responsiveWidthScale(30),
  },

  titulo: {
    fontFamily: FONTS.bold,
    fontSize: responsiveWidthScale(21),
    lineHeight: responsiveWidthScale(27),
    color: COLORS.black,
    marginBottom: responsiveWidthScale(24),
  },

  parrafo: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(14, responsiveWidthScale(16)),
    lineHeight: responsiveWidthScale(25),
    color: COLORS.black,
    marginBottom: responsiveWidthScale(20),
  },

  correo: {
    fontFamily: FONTS.regular,
    color: COLORS.greenM,
  },

  firma: {
    alignSelf: "flex-start",
    fontFamily: FONTS.bold,
    fontSize: Math.max(14, responsiveWidthScale(16)),
    color: COLORS.black,
    marginTop: responsiveWidthScale(4),
  },

  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },

  modalCorreo: {
    minHeight: responsiveHeightScale(180),
    width: "100%",
    backgroundColor: COLORS.back,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: responsiveWidthScale(5),
    borderTopLeftRadius: responsiveWidthScale(5),
    paddingHorizontal: responsiveWidthScale(25),
    paddingVertical: responsiveHeightScale(24),
  },

  modalCerrarContainer: {
    position: "absolute",
    top: responsiveHeightScale(14),
    right: responsiveWidthScale(25),
    zIndex: 2,
  },

  modalContenido: {
    alignItems: "center",
    justifyContent: "center",
  },

  textModal: {
    fontFamily: FONTS.bold,
    color: COLORS.black,
    fontSize: Math.max(11, responsiveWidthScale(15)),
    textAlign: "center",
    marginTop: responsiveHeightScale(8),
  },

  correoModal: {
    fontFamily: FONTS.regular,
    color: COLORS.greenM,
    fontSize: Math.max(11, responsiveWidthScale(14)),
    textAlign: "center",
    marginTop: responsiveHeightScale(5),
  },
});