import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Input from "../components/input";
import { COLORS } from "../constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import Modal from "react-native-modal";
import { msGppMaybe } from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";
import { FONTS } from "../constants/fonts";

import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

console.log("ANCHO LOGICO:", width);
console.log("ALTO LOGICO:", height);
console.log("PIXEL RATIO:", PixelRatio.get());

const INITIAL_STATE = {
  user: "",
  pass: "",
};

const Login = () => {
  const { authError, login } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const [input, setInput] = useState(INITIAL_STATE);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [minLengthPass, setMinLengthPass] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState({
    touched: false,
    isValid: false,
  });
  const [isPassValid, setIsPassValid] = useState({
    touched: false,
    isValid: false,
  });

  const [recuerdame, setRecuerdame] = useState(false);
  const navigation = useNavigation();

  const onHandleValidationEmail = (currentEmail) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailRegex2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    if (!emailRegex2.test(currentEmail.trim().toLowerCase())) isValid = false;
    setIsEmailValid({
      touched: true,
      isValid: isValid,
    });
    return {
      touched: true,
      isValid: isValid,
    };
  };

  const setEmailChange = (text) => {
    setEmail(text);
    //onHandleValidationEmail();
  };

  const onSignUpHandler = () => {
    navigation.navigate("Registro");
  };

  const onLogInHandler = async (emailParam, passParam) => {
    const currentEmail = typeof emailParam === "string" ? emailParam : email;
    const currentPass = typeof passParam === "string" ? passParam : pass;

    try {
      //await handleLoginFirebase(currentEmail, currentPass);

      if (recuerdame) {
        await AsyncStorage.setItem("email", currentEmail);
        await AsyncStorage.setItem("pass", currentPass);
      }

      const success = await login({
        email: currentEmail,
        password: currentPass,
      });

      if (!success) {
        setModalVisible(true);
        return;
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (email !== "") {
      onHandleValidationEmail(email);
    }
  }, [email]);

  useEffect(() => {
    if (pass.length > 7) {
      setMinLengthPass(true);
    } else {
      setMinLengthPass(false);
    }
  }, [pass]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{
          margin: 0,
          justifyContent: "flex-end",
        }}
      >
        <View style={styles.modalCredenciales}>
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

            <Text style={styles.textModal}>Credenciales incorrectas</Text>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.containerTitle}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Ingresa a tu cuenta</Text>
        </View>
        <View style={styles.containerlogin}>
          <View style={styles.containercorreo}>
            <View style={styles.textoCorreo}>
              <Text style={styles.label}>Correo electrónico:</Text>
            </View>
            <View style={styles.inputcorreo}>
              <View width={"90%"}>
                <Input
                  id="user"
                  label="Usuario"
                  setInput={setEmailChange}
                  value={email}
                  keyboardType="email-address"
                />
              </View>
            </View>
          </View>
          <View style={styles.conteinerpass}>
            <View style={styles.textoPass}>
              <Text style={styles.label}>Contraseña:</Text>
            </View>
            <View style={styles.inputpass}>
              <Input
                id="pass"
                label="Clave"
                minLength={8}
                secureTextEntry
                setInput={setPass}
                value={pass}
                // onSelectionChange={onHandleValidationPassword}
              />
            </View>
          </View>
          <View style={styles.rememberForget}>
            <TouchableOpacity
              style={styles.remember}
              onPress={() => setRecuerdame(!recuerdame)}
            >
              <Ionicons
                name="checkmark-circle"
                size={responsiveWidthScale(20)}
                color={recuerdame ? COLORS.greenM : COLORS.grey}
              />
              <Text style={styles.labelforget}>Recordarme</Text>
            </TouchableOpacity>
            <View style={styles.forget}>
              <Text style={styles.forgetText}>Olvidaste la contraseña?</Text>
            </View>
          </View>
        </View>
        <View style={styles.Ingresar}>
          <TouchableOpacity
            style={styles.buttonIngresar}
            activeOpacity={0.8}
            onPress={onLogInHandler}
          >
            <Text style={styles.IngresarText}>INGRESAR</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.Registro}>
          <View style={styles.crearCuenta}>
            <Text style={styles.labelcuenta}>No tienes cuenta?</Text>
          </View>
          <TouchableOpacity
            style={styles.buttonRegistro}
            activeOpacity={0.8}
            onPress={onSignUpHandler}
          >
            <Text style={styles.RegistroText}>Regístrate Aquí</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: responsiveHeightScale(320),
  },
  container: {
    flex: 1,
    paddingVertical: "30%",
    paddingHorizontal: "5%",
    backgroundColor: COLORS.back,
    alignContent: "center",
  },
  containerTitle: {
    alignItems: "center",
    paddingVertical: responsiveHeightScale(15),
    justifyContent: "center",
  },
  title: {
    color: COLORS.greenM,
    fontSize: Math.max(11, responsiveWidthScale(35)),
    letterSpacing: responsiveWidthScale(2),
    fontFamily: FONTS.bold,
    marginVertical: responsiveHeightScale(4),
  },
  subtitle: {
    color: COLORS.grey,
    fontSize: Math.max(11, responsiveWidthScale(16)),
    fontFamily: FONTS.bold,
  },
  containerlogin: {
    marginTop: responsiveHeightScale(95),
    alignSelf: "center",
    width: "100%",
  },
  textoCorreo: {
    width: "80%",
  },
  containercorreo: {
    flexDirection: "column",
    alignItems: "center",
  },
  inputcorreo: {
    backgroundColor: COLORS.verdeclaro,
    textAlign: "center",
    width: "85%",
    height: responsiveHeightScale(50),
    borderRadius: responsiveWidthScale(10),
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conteinerpass: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: responsiveHeightScale(10),
  },
  textoPass: {
    width: "80%",
  },
  inputpass: {
    backgroundColor: COLORS.verdeclaro,
    textAlign: "center",
    width: "85%",
    fontSize: Math.max(11, responsiveWidthScale(13)),
    height: responsiveHeightScale(50),
    borderRadius: responsiveWidthScale(10),
  },
  label: {
    color: COLORS.greenM,
    fontSize: Math.max(11, responsiveWidthScale(15)),
    fontFamily: FONTS.bold,
    marginVertical: responsiveHeightScale(8),
  },
  Ingresar: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsiveHeightScale(55),
  },
  buttonIngresar: {
    backgroundColor: COLORS.greenM,
    width: "56%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: responsiveWidthScale(25),
    height: responsiveHeightScale(47),
  },
  IngresarText: {
    color: COLORS.back,
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(16)),
    letterSpacing: responsiveWidthScale(1.5),
  },
  Registro: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "54%",
    marginTop: responsiveHeightScale(8),
  },
  buttonRegistro: {
    justifyContent: "center",
    alignItems: "center",
  },
  RegistroText: {
    color: COLORS.greenM,
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    textDecorationLine: "underline",
  },
  labelcuenta: {
    color: COLORS.black,
    fontSize: Math.max(11, responsiveWidthScale(14)),
    fontFamily: FONTS.regular,
  },
  crearCuenta: {
    justifyContent: "center",
    alignItems: "center",
  },
  rememberForget: {
    alignSelf: "center",
    flexDirection: "row",
    width: "80%",
    marginTop: responsiveHeightScale(5),
    alignItems: "center",
  },
  labelforget: {
    color: COLORS.black,
    fontSize: Math.max(11, responsiveWidthScale(14)),
    marginLeft: responsiveWidthScale(5),
    fontFamily: FONTS.regular,
  },
  forgetText: {
    color: COLORS.greenM,
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    textDecorationLine: "underline",
  },
  remember: {
    flexDirection: "row",
    alignItems: "center",
  },
  forget: {
    flex: 1,
    alignItems: "flex-end",
    alignSelf: "center",
  },
  modalCredenciales: {
    height: responsiveHeightScale(154),
    width: "100%",
    backgroundColor: COLORS.back,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: responsiveWidthScale(5),
    borderTopLeftRadius: responsiveWidthScale(5),
    paddingHorizontal: responsiveWidthScale(25),
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
  },
});
