import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import SelectorRegistro from "../components/SelectorRegistro";
import { REGIONES } from "../data/regiones";
import { COMUNAS } from "../data/comunas";
import { COLORS } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { profilesRepository } from "../infrastructure/profilesRepository";
import { useNavigation } from "@react-navigation/native";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";
import { FONTS } from "../constants/fonts";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { msGppMaybe } from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";

const SelectDistrito = () => {
  const [regionSelect, setRegionSelect] = useState();
  const [comunaSelect, setComunaSelect] = useState();
  const [distritoSelect, setDistritoSelect] = useState(null);
  const { user, tipoAuth, setTipoAuth, actualizarUsuario } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");

  const mostrarModal = (mensaje) => {
    setMensajeModal(mensaje);
    setModalVisible(true);
  };

  const navigation = useNavigation();

  const COMUNASSELECTED = COMUNAS.filter(
    (comunas) => comunas.key === regionSelect,
  ).sort((a, b) => a.label.localeCompare(b.label));

  const onChangeDistrito = async () => {
    if (
      !regionSelect ||
      !comunaSelect ||
      !distritoSelect ||
      !user?.id
    ) {
      return;
    }

    const regionSeleccionada = REGIONES.find(
      (region) => region.value === regionSelect,
    );

    const comunaSeleccionada = COMUNAS.find(
      (comuna) => comuna.value === comunaSelect,
    );

    if (!regionSeleccionada || !comunaSeleccionada) {
      mostrarModal(
        "No se pudo identificar la región o comuna seleccionada.",
      );
      return;
    }

    try {
      await profilesRepository.updateCircunscripcionAndDistrito(
        user.id,
        regionSelect,
        distritoSelect,
        regionSeleccionada.label,
        comunaSeleccionada.label,
      );

      await actualizarUsuario({
        distrito: distritoSelect,
        circunscripcion: regionSelect,
        region: regionSeleccionada.label,
        comuna: comunaSeleccionada.label,
      });

      // Usuario que acaba de completar el registro.
      if (tipoAuth === "register") {
        setTipoAuth("login");
        return;
      }

      // Usuario que entró desde la aplicación para cambiar su distrito.
      navigation.replace("MyDrawer", {
        screen: "Principal",
        params: {
          screen: "Diputados",
          params: {
            screen: "ListaDiputados",
            params: {
              distrito: distritoSelect,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error al actualizar ubicación:", error);

      const mensajeError = error?.message || "";

      if (mensajeError.includes("CAMBIO_UBICACION_BLOQUEADO")) {
        const mensajeLimpio = mensajeError
          .replace("CAMBIO_UBICACION_BLOQUEADO:", "")
          .trim();

        mostrarModal(mensajeLimpio);
        return;
      }

      mostrarModal(
        "No se pudo guardar tu ubicación. Inténtalo nuevamente.",
      );
    }
  };

  const handlerSelectDistrito = (comuna) => {
    setComunaSelect(comuna);
    if (comuna > 0 && comuna < 5) {
      setDistritoSelect(1);
    } else if (comuna < 11) {
      setDistritoSelect(2);
    } else if (comuna < 19) {
      setDistritoSelect(3);
    } else if (comuna < 28) {
      setDistritoSelect(4);
    } else if (comuna < 43) {
      setDistritoSelect(5);
    } else if (comuna < 69) {
      setDistritoSelect(6);
    } else if (comuna < 81) {
      setDistritoSelect(7);
    } else if (comuna < 89) {
      setDistritoSelect(8);
    } else if (comuna < 97) {
      setDistritoSelect(9);
    } else if (comuna < 103) {
      setDistritoSelect(10);
    } else if (comuna < 108) {
      setDistritoSelect(11);
    } else if (comuna < 113) {
      setDistritoSelect(12);
    } else if (comuna < 119) {
      setDistritoSelect(13);
    } else if (comuna < 133) {
      setDistritoSelect(14);
    } else if (comuna < 146) {
      setDistritoSelect(15);
    } else if (comuna < 166) {
      setDistritoSelect(16);
    } else if (comuna < 185) {
      setDistritoSelect(17);
    } else if (comuna < 196) {
      setDistritoSelect(18);
    } else if (comuna < 217) {
      setDistritoSelect(19);
    } else if (comuna < 228) {
      setDistritoSelect(20);
    } else if (comuna < 250) {
      setDistritoSelect(21);
    } else if (comuna < 266) {
      setDistritoSelect(22);
    } else if (comuna < 282) {
      setDistritoSelect(23);
    } else if (comuna < 294) {
      setDistritoSelect(24);
    } else if (comuna < 306) {
      setDistritoSelect(25);
    } else if (comuna < 324) {
      setDistritoSelect(26);
    } else if (comuna < 334) {
      setDistritoSelect(27);
    } else if (comuna < 345) {
      setDistritoSelect(28);
    } else {
      mostrarModal("No se pudo identificar el distrito seleccionado.");
    }
  };

  const responsiveBoth = (baseValue, minValue = 0) => {
    return Math.max(
      minValue,
      Math.min(
        responsiveWidthScale(baseValue),
        responsiveHeightScale(baseValue),
      ),
    );
  };

  return (
    <View style={styles.container}>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        presentationStyle="overFullScreen"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalAlerta}>
                <View style={styles.modalCerrarContainer}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
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
                  <MsIcon
                    icon={msGppMaybe}
                    size={responsiveWidthScale(45)}
                    color={COLORS.greenM}
                  />

                  <Text style={styles.textModal}>
                    {mensajeModal}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {comunaSelect ? (
        <View style={styles.containerDistrito}>
          <View style={styles.distritoLabel}>
            <Text
              style={[
                styles.distritoTitulo,
                {
                  textAlign: distritoSelect < 10 ? "right" : "center",
                  fontSize: responsiveBoth(60),
                },
              ]}
            >
              DISTRITO
            </Text>
          </View>
          <Text
            style={[
              styles.distrito,
              {
                paddingRight:
                  distritoSelect < 10 ? responsiveWidthScale(15) : 0,
                fontSize: responsiveBoth(290),
              },
            ]}
          >
            {distritoSelect}
          </Text>
        </View>
      ) : null}
      <View style={styles.containerTitle}>
        <Text style={styles.title}>Selección de distrito</Text>
      </View>
      <View style={styles.containerSelect}>
        <Text style={styles.label}>Región:</Text>
        <View style={styles.input}>
          <SelectorRegistro
            value={regionSelect}
            placeholder="Selecciona tu región"
            title="Selecciona tu región"
            options={REGIONES.map((region) => ({
              label: region.label,
              value: region.value,
            }))}
            onChange={(value) => {
              setRegionSelect(value);
              setComunaSelect(undefined);
              setDistritoSelect(null);
            }}
          />
        </View>
        <Text style={[styles.label, styles.comunaLabel]}>Comuna:</Text>
        <View style={styles.input}>
          <SelectorRegistro
            value={comunaSelect}
            placeholder="Selecciona tu comuna"
            title="Selecciona tu comuna"
            options={COMUNASSELECTED.map((comuna) => ({
              label: comuna.label,
              value: comuna.value,
            }))}
            onChange={handlerSelectDistrito}
          />
        </View>
      </View>
      <View style={styles.containerButon}>
        <TouchableOpacity style={styles.buton} onPress={onChangeDistrito}>
          <Text style={styles.ingresar}>INGRESAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.back,
    justifyContent: "flex-start",
    paddingTop: responsiveHeightScale(420),
  },

  containerTitle: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: responsiveHeightScale(8),
  },

  title: {
    color: COLORS.greenM,
    fontSize: Math.max(
      11,
      Math.min(
        responsiveWidthScale(30),
        responsiveHeightScale(30),
      ),
    ),
    letterSpacing: responsiveWidthScale(2),
    fontFamily: FONTS.bold,
    textAlign: "center",
  },

  containerSelect: {
    marginTop: responsiveHeightScale(55),
    justifyContent: "center",
    width: "85%",
  },

  label: {
    color: COLORS.greenM,
    fontSize: Math.max(
      11,
      Math.min(
        responsiveWidthScale(15),
        responsiveHeightScale(15),
      ),
    ),
    fontFamily: FONTS.bold,
    marginVertical: responsiveHeightScale(4),
    marginLeft: responsiveWidthScale(4),
  },

  comunaLabel: {
    marginTop: responsiveHeightScale(30),
  },

  input: {
    width: "100%",
    height: responsiveHeightScale(54),
    marginTop: responsiveHeightScale(5),
    borderRadius: responsiveWidthScale(10),
    backgroundColor: COLORS.verdeclaro,
    justifyContent: "center",
  },

  containerButon: {
    alignItems: "center",
    width: "95%",
    marginTop: responsiveHeightScale(70),
  },

  buton: {
    backgroundColor: COLORS.greenM,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: responsiveWidthScale(20),
    height: responsiveHeightScale(44),
  },

  ingresar: {
    color: COLORS.back,
    fontFamily: FONTS.bold,
    fontSize: Math.max(
      11,
      Math.min(
        responsiveWidthScale(16),
        responsiveHeightScale(16),
      ),
    ),
    letterSpacing: responsiveWidthScale(1.5),
  },

  containerDistrito: {
    position: "absolute",
    top: responsiveHeightScale(75),
    right: 0,
    paddingRight: responsiveWidthScale(10),
    width: "76%",
    height: responsiveHeightScale(360),
    alignItems: "flex-end",
  },

  distritoLabel: {
    width: "100%",
  },

  distritoTitulo: {
    color: COLORS.verdeclaro,
    fontFamily: FONTS.bold,
    letterSpacing: responsiveWidthScale(-2),
    marginTop: responsiveHeightScale(3),
    includeFontPadding: false,
  },

  distrito: {
    color: COLORS.verdeclaro,
    fontFamily: FONTS.bold,
    letterSpacing: responsiveWidthScale(-20),
    includeFontPadding: false,
    marginTop: -Math.min(
      responsiveWidthScale(100),
      responsiveHeightScale(100),
    ),
  },
  modalAlerta: {
    minHeight: responsiveHeightScale(154),
    width: "100%",
    backgroundColor: COLORS.back,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: responsiveWidthScale(5),
    borderTopLeftRadius: responsiveWidthScale(5),
    paddingHorizontal: responsiveWidthScale(25),
    paddingVertical: responsiveHeightScale(20),
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
    marginTop: responsiveHeightScale(6),
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
});
export default SelectDistrito;
