import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
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

const SelectDistrito = () => {
  const [regionSelect, setRegionSelect] = useState();
  const [comunaSelect, setComunaSelect] = useState();
  const [distritoSelect, setDistritoSelect] = useState(null);
  const { user, tipoAuth, setTipoAuth, actualizarUsuario } = useAuth();

  const navigation = useNavigation();

  const COMUNASSELECTED = COMUNAS.filter(
    (comunas) => comunas.key === regionSelect,
  ).sort((a, b) => a.label.localeCompare(b.label));

  // const userData = useSelector(state => state.login.user);
  // console.log("userdata: ", userData);

  const onChangeDistrito = async () => {
    if (!regionSelect || !distritoSelect || !user?.id) return;

    try {
      await profilesRepository.updateCircunscripcionAndDistrito(
        user.id,
        regionSelect,
        distritoSelect,
      );

      await actualizarUsuario({
        distrito: distritoSelect,
        circunscripcion: regionSelect,
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
      console.error("Error al actualizar distrito y circunscripción:", error);

      Alert.alert(
        "Error",
        "No se pudo guardar tu distrito. Inténtalo nuevamente.",
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
      Alert.alert("Error");
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
          <Picker
            selectedValue={regionSelect}
            onValueChange={(itemValue) => setRegionSelect(itemValue)}
            style={styles.picker}
          >
            <Picker.Item
              label="Selecciona tu región"
              value={null}
              color={COLORS.black}
            />
            {REGIONES.map((region) => (
              <Picker.Item
                key={region.value}
                label={region.label}
                value={region.value}
              />
            ))}
          </Picker>
        </View>
        <Text style={[styles.label, styles.comunaLabel]}>Comuna:</Text>
        <View style={styles.input}>
          <Picker
            selectedValue={comunaSelect}
            onValueChange={handlerSelectDistrito}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona tu comuna" value={null} />
            {COMUNASSELECTED.map((comuna) => (
              <Picker.Item
                key={comuna.value}
                label={comuna.label}
                value={comuna.value}
              />
            ))}
          </Picker>
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
    overflow: "hidden",
    justifyContent: "center",
  },

  picker: {
    width: "100%",
    height: responsiveHeightScale(54),
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: Math.max(
      11,
      Math.min(
        responsiveWidthScale(16),
        responsiveHeightScale(16),
      ),
    ),
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
  },

  distrito: {
    color: COLORS.verdeclaro,
    fontFamily: FONTS.bold,
    letterSpacing: responsiveWidthScale(-20),
    marginTop: responsiveHeightScale(-45),
  },
});
export default SelectDistrito;
