import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import Input from "../components/input";
import { useDispatch, useSelector } from "react-redux";
import { signup, login } from "../store/actions/login.actions";
import { filteredDiputados } from "../store/actions/diputado.action";
import { filteredSenadores } from "../store/actions/senador.action";
import { COLORS } from "../constants/colors";
import * as SQLite from "expo-sqlite";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, dbFirestore } from "../constants/config";
import { doc, getDoc } from "firebase/firestore";


const INITIAL_STATE = {
  user: "",
  pass: "",
};

const Login = () => {
  const dispatch = useDispatch();

  const [regionSelect, setRegionSelect] = useState();
  const [distritoSelect, setDistritoSelect] = useState(null);

  const fetchDistrito = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("distritoSelect.db");
      const result = await db.getAllAsync("SELECT * FROM distritoSelect;");
      if (result.length > 0) {
        const { distrito, region } = result[0];
        setDistritoSelect(distrito);
        setRegionSelect(region);
        console.log(region, distrito);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const onHandleValidationPassword = (currentPass = "") => {
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    let isValid = true;
    if (!passRegex.test(currentPass.toLowerCase())) isValid = false;
    setIsPassValid({
      touched: true,
      isValid: isValid,
    });
    return {
      touched: true,
      isValid: isValid,
    };
  };

  const onSignUpHandler = () => {
    navigation.navigate("Registro");
  };

  const handleLoginFirebase = async (email, pass) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass );
      const uid = userCredential.user.uid;
      const userRef = doc(dbFirestore, "usuarios", uid);
      const userInfo = await getDoc(userRef);

      if ( !userInfo.exists() ) {
        Alert.alert("Error", "Usuario no registrado")
      }

      const data = userInfo.data();

      //dispatch({ type: 'LOGIN_FIREBASE', userData: uid })
      navigation.navigate("SelectDistrito");


      console.log(data);
    } catch (error) {
      console.error(error)
    }
  }

  const onLogInHandler = async (emailParam, passParam) => {

    const currentEmail = typeof emailParam === "string" ? emailParam : email;
    const currentPass = typeof passParam === "string" ? passParam : pass;


    const emailValid = onHandleValidationEmail(currentEmail);
    const passValid = onHandleValidationPassword(currentPass);

    if (!emailValid.isValid || !passValid.isValid) {
      Alert.alert(
        "No ha completado sus datos",
        "Por favor introduzca correo y contraseña",
        [{ text: "Ok" }]
      );
      return;
    }
    try {

      //await handleLoginFirebase(currentEmail, currentPass);

      if (recuerdame) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("pass", pass);
      }

      fetchDistrito();
      dispatch(
        login(currentEmail, currentPass),
        filteredDiputados(distritoSelect),
        filteredSenadores(regionSelect)
      );
      //validar respuesta de login, si es exitosa hacer navigate a MyDrawer
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
      behavior={Platform.OS === 'ios' ? "padding" : "height"}
      style={{flex: 1}}
    >

    {/* <View style={styles.container}> */}

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
            <View width={'90%'}> 
                <Input
                id="user"
                label="Usuario"
                setInput={setEmailChange}
                value={email}
                keyboardType="email-address"
                />
            </View>
            <FontAwesome name="check" size={16} fill={true} color={COLORS.grey} marginRight={'4%'} style={
              isEmailValid.isValid && {
                color: COLORS.greenM,
              }
            }/>
          </View>
          {isEmailValid.touched && !isEmailValid.isValid && (
            <Text style={styles.inputErrors}>Introduce un email válido</Text>
          )}
        </View>
        <View style={styles.conteinerpass}>
          <View style={styles.textoPass}>
            <Text style={styles.label}>Contraseña:</Text>
          </View>
          <View
            style={styles.inputpass}>
            <Input
              id="pass"
              label="Clave"
              minLength={8}
              secureTextEntry
              setInput={setPass}
              value={pass}
              // onSelectionChange={onHandleValidationPassword}
            />
            {isPassValid.touched && !isPassValid.isValid && (
              <Text style={styles.inputErrors}>
                Mínimo 8 caracteres
              </Text>
            )}
          </View>
        </View>
        <View style={styles.rememberForget}>
          <TouchableOpacity
            style={styles.remember}
            onPress={() => setRecuerdame(!recuerdame)}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
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
      <View style={styles.RegistroGoogle}>
        <Text style={styles.labelgoogle}>O continuar con</Text>
        <View style={styles.logoGloboGoogle}>
          <Image
            style={styles.logoGoogle}
            source={require("../assets/otros/Google__G__logo.svg.png")}
          />
        </View>
      </View>

    </ScrollView>
    {/* </View> */}
    </KeyboardAvoidingView>

  );
};

export default Login;

const styles = StyleSheet.create({
  scrollContainer:{
      flexGrow: 1,
      paddingTop: 100
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
    top: "7%",
    margintop: 600,
    paddingVertical: 15,
    justifyContent: "center",
  },
  title: {
    color: COLORS.greenM,
    fontSize: 35,
    fontWeight: "bold",
    letterSpacing: 2,
    fontFamily: "NotoSansMyanmar_700Bold",
    marginVertical: "2%",
  },
  subtitle: {
    color: COLORS.grey,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "NotoSansMyanmar_700Bold",
  },
  containerlogin: {
    marginTop: "48%",
    height: "24%",
    alignSelf: "center",
    width: "100%",
  },
  textoCorreo: {
    width: "85%",
  },
  containercorreo: {
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    height: "50%",
  },
  inputcorreo: {
    backgroundColor: COLORS.verdeclaro,
    textAlign: "center",
    width: "90%",
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conteinerpass: {
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    height: "50%",
  },
  textoPass: {
    width: "85%",
  },
  inputErrors: {
    color: COLORS.falso,
    fontSize: 13,
    textAlign: "center",
    fontFamily: "NotoSansMyanmar_400Regular",
  },
  inputpass: {
    backgroundColor: COLORS.verdeclaro,
    textAlign: "center",
    width: "90%",
    fontSize: 13,
    height: 50,
    borderRadius: 10,
  },
  label: {
    color: COLORS.greenM,
    fontSize: 15,
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontWeight: "bold",
    marginVertical: "3%",
  },
  Ingresar: {
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 115,
    justifyContent: "center",
  },
  buttonIngresar: {
    backgroundColor: COLORS.greenM,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: 50,
  },
  IngresarText: {
    color: "#ffffff",
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 16,
    letterSpacing: 1.5,
    fontWeight: "bold",
  },
  Registro: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "55%",
  },
  buttonRegistro: {
    justifyContent: "center",
    alignItems: "center",
  },
  RegistroText: {
    color: COLORS.greenM,
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 13,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  labelcuenta: {
    color: COLORS.black,
    fontSize: 14,
    fontFamily: "NotoSansMyanmar_400Regular",
  },
  crearCuenta: {
    justifyContent: "center",
    alignItems: "center",
  },
  rememberForget: {
    alignSelf: "center",
    textAlign: "center",
    flexDirection: "row",
    width: "86%",
  },
  labelforget: {
    color: COLORS.black,
    fontSize: 14,
    marginLeft: "3%",
    fontFamily: "NotoSansMyanmar_400Regular",
  },
  forgetText: {
    color: COLORS.greenM,
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 13,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  remember: {
    flexDirection: "row",
    alignItems: 'center'
  },
  forget: {
    flex: 1,
    alignItems: "flex-end",
    alignSelf: 'center'
  },
  RegistroGoogle: {
    alignItems: "center",
    top: "2%",
    flexDirection: "row",
    width: "43%",
    justifyContent: "center",
    alignSelf: "center",
  },
  labelgoogle: {
    color: COLORS.black,
    fontSize: 14,
    fontFamily: "NotoSansMyanmar_400Regular",
    fontWeight: "bold",
    flex: 1,
  },
  logoGoogle: {
    width: 35,
    height: 35,
  },
  logoGloboGoogle: {
    width: 58,
    height: 58,
    borderColor: COLORS.grey,
    borderRadius: 100,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
});
