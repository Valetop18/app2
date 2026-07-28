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
  responsiveVerticalSize,
  responsiveSpacing,
  responsiveFont,
  responsiveIcon,
  responsiveSize,
} from "../utils/responsive";

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

  return (
    <View style={styles.container}>
      {comunaSelect ? (
        <View style={styles.containerDistrito}>
          <View style={styles.distritoLabel}>
            <Text
              style={[
                styles.distritoTitulo,
                { textAlign: distritoSelect < 10 ? "right" : "center" },
              ]}
            >
              DISTRITO
            </Text>
          </View>
          <Text
            style={[
              styles.distrito,
              { paddingRight: distritoSelect < 10 ? 15 : 0 },
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
        <Text style={styles.label} marginTop={"8%"}>
          Comuna:
        </Text>
        <View style={styles.input}>
          <Picker
            selectedValue={comunaSelect}
            onValueChange={handlerSelectDistrito}
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
    justifyContent: "center",
  },
  containerTitle: {
    width: "80%",
    alignItems: "center",
    alignContent: "center",
    paddingVertical: responsiveVerticalSize(8),
    marginTop: "120%",
  },
  title: {
    color: COLORS.greenM,
    fontSize: responsiveFont(30),
    fontWeight: "bold",
    letterSpacing: 2,
    fontFamily: "NotoSansMyanmar-Regular",
  },
  containerSelect: {
    marginTop: "5%",
    height: "30%",
    justifyContent: "center",
    width: "85%",
  },
  input: {
    width: "100%",
    fontFamily: "NotoSansMyanmar-Regular",
    fontSize: responsiveFont(20),
    marginVertical: responsiveVerticalSize(5),
    marginTop: responsiveVerticalSize(5),
    borderRadius: 10,
    backgroundColor: COLORS.verdeclaro,
    color: COLORS.black,
  },
  label: {
    color: COLORS.greenM,
    fontSize: responsiveFont(15),
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontWeight: "bold",
    marginVertical: responsiveVerticalSize(4),
    marginLeft: responsiveSpacing(4),
  },
  buton: {
    backgroundColor: COLORS.greenM,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: "15%",
  },
  containerButon: {
    alignItems: "center",
    top: "3%",
    width: "95%",
    height: "30%",
},
  ingresar: {
    color: "#ffffff",
    fontFamily: "NotoSansMyanmar-Regular",
    fontSize: 16,
    letterSpacing: 1.5,
    fontWeight: "bold",
  },
  distrito: {
    color: COLORS.verdeclaro,
    fontSize: responsiveFont(290),
    fontWeight: "bold",
    letterSpacing: -20,
    marginTop: "-40%",
  },
  containerDistrito: {
    paddingRight: 10,
    width: "76%",
    height: "36%",
    alignSelf: "flex-end",
    alignItems: "flex-end",
    alignContent: "stretch",
    top: "5%",
    position: "absolute",
  },
  distritoLabel: {
    width: "100%",
  },
  distritoTitulo: {
    color: COLORS.verdeclaro,
    fontSize: responsiveFont(60),
    fontWeight: "bold",
    letterSpacing: -2,
    marginTop: "3%",
  },
});
export default SelectDistrito;
