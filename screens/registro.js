import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
  TextInput,
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { dbFirestore, auth } from "../constants/config";
import { collection, getDocs, doc, setDoc, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


const INITIAL_STATE = {
  user: "",
  pass: "",
};

const Registro = () => {
  const dispatch = useDispatch();

  const [input, setInput] = useState(INITIAL_STATE);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState("");
  const [pais, setPais] = useState("");
  const [rut, setRut] = useState("");
  const [minLengthPass, setMinLengthPass] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const [isEmailValid, setIsEmailValid] = useState({
    touched: false,
    isValid: false,
  });
  const [isPassValid, setIsPassValid] = useState({
    touched: false,
    isValid: false,
  });

  const [errores, setErrores] = useState({});

  const navigation = useNavigation();

  const onHandleValidationEmail = (currentEmail) => {
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

  const setRutNuevo = (float) => {
    setRut(float);
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

  const validarFecha = () => {
    const hoy = new Date();
    const fechaValida = date <= hoy;
    return fechaValida;
  };

  const validarRut = (rut = "") => {
    rut = rut.replace(/\./g, "").replace("-", "");
    if (rut.length < 8) return false;
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();
    let suma = 0;
    let multiplo = 2;

    for (let i = 1; i <= cuerpo.length; i++) {
      let index = multiplo * rut.charAt(cuerpo.length - i);
      suma = suma + index;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    let dvEsperado = 11 - (suma % 11);
    dvEsperado =
      dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
    return dv === dvEsperado;
  };

  const validarEmail = () => {
    const emailRegex2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex2.test(email.trim().toLowerCase());
  };

  const validarCampos = () => {
    console.log("inicio validacion");
    let nuevosErrores = {};

    try {
      if (nombre?.trim().length < 2) {
        nuevosErrores.nombre = true;
      }

      if (!validarFecha()) {
        nuevosErrores.fechaNacimiento = true;
      }

      if (genero?.trim() === "") {
        nuevosErrores.genero = true;
      }

      if (pais?.trim() === "") {
        nuevosErrores.pais = true;
      }

      if (rut?.trim() === "") {
        nuevosErrores.rut = true;
      }

      if (pais === "Chile" || !validarRut(rut)) {
        //nuevosErrores.rut = true;
      }

      if (pais === "Extranjero" || rut.length < 3) {
        nuevosErrores.rut = true;
      }

      if (!validarEmail()) {
        //nuevosErrores.email = true;
      }

      if (pass !== confirmPass) {
        nuevosErrores.confirmPass = true;
      }
    } catch (error) {
      console.error(error);
    }

    console.log("errores:");
    console.log(nuevosErrores);

    setErrores(nuevosErrores);

    if ( Object.keys(nuevosErrores).length === 0    ) {
      return true;
    }else{
      return false;
    }

  };

  const onSignUpHandler = async () => {


    //to-do: validaciones
    const camposValidos = validarCampos();

    if ( !camposValidos ) {
      return;
    }
    

    try {

      //validar duplicacion de rut
      const q = query(
        collection(dbFirestore, "usuarios"),
        where("rut", "==", rut)
      );

      const userQuery = await getDocs(q);

      if ( !userQuery.empty ) {
        Alert.alert("rut ya registrado")
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: nombre });

      await setDoc(doc(dbFirestore, "usuarios", user.uid), {
        nombre,
        email,
        fechaNacimiento: date,
        genero,
        pais,
        rut,
        creadoEn: new Date(),
      });

      navigation.navigate("TopicosInteres", { uid: user.uid });
    } catch (error) {
      console.error(error);
    }
    
  };

  const onLogInHandler = () => {
    navigation.navigate("TopicosInteres", { uid: "HLTGZTb1kJbOMWqttx1ufsZXu9r1"});
  };

  //, { uid: "HLTGZTb1kJbOMWqttx1ufsZXu9r1"}
  
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

  const displayDate = () => {

    const opciones = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    return date.toLocaleDateString( 'es-ES', opciones );

  }

  return (
    <View style={styles.container}>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>Registro</Text>
        <Text style={styles.subtitle}>Crea tu cuenta</Text>
      </View>
      <View style={styles.containerlogin}>
        <View style={styles.containercorreo}>
          <View style={styles.textoCorreo}>
            <Text style={styles.label}>Nombre:</Text>
          </View>
          <View style={styles.inputcorreo}>
            <View width={"90%"}>
              <Input
                id="user"
                label="Usuario"
                setInput={setNombre}
                value={nombre}
                keyboardType="default"
                textAlign="left"
                paddingHorizontal="1%"
                fontFamily="NotoSansMyanmar_400Regular"
              />
            </View>
            <FontAwesome
              name="check"
              size={14}
              fill={true}
              color={errores.nombre ? COLORS.greenM : COLORS.verdeclaro}
              marginRight={"4%"}
            />
          </View>
          {errores.nombre ? (
            <Text style={styles.inputErrors}>Introduce un nombre válido</Text>
          ) : null}
        </View>
        <View style={styles.containercorreo}>
          <View style={styles.textoCorreo}>
            <Text style={styles.label}>Fecha de Nacimiento:</Text>
          </View>
          <View style={styles.inputcorreo}>
            <View width={"90%"}>
              <TouchableOpacity
                style={styles.butonFecha}
                color={COLORS.verdeclaro}
                onPress={showDatepicker}
              >

              <Text>{displayDate()}</Text>

              </TouchableOpacity>

              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChangeDate}
                  style={styles.butonFecha}
                />

              )}
            </View>
            <FontAwesome
              name="check"
              size={14}
              fill={true}
              color={errores.fechaNacimiento ? COLORS.greenM : COLORS.verdeclaro}
              marginRight={"4%"}
            />
            {errores.fechaNacimiento ? (
              <Text style={styles.inputErrors}>Introduce un fecha válida</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.containercorreo}>
          <View style={styles.textoCorreo}>
            <Text style={styles.label}>Género:</Text>
          </View>
          <View style={styles.inputcorreo}>
            <View width={"90%"}>
              <Picker
                selectedValue={genero}
                onValueChange={(itemValue, itemIndex) => setGenero(itemValue)}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Femenino" value="Femenino" />
                <Picker.Item label="Masculino" value="Masculino" />
                <Picker.Item label="LGTBIQ+" value="LGTBIQ+" />
              </Picker>
            </View>
            <FontAwesome
              name="check"
              size={14}
              fill={true}
              color={errores.genero ? COLORS.greenM : COLORS.verdeclaro}
              marginRight={"4%"}
            />
          </View>
          {errores.genero ? (
            <Text style={styles.inputErrors}>Selecciona un género</Text>
          ) : null}
        </View>
        <View style={styles.containercorreo}>
          <View style={styles.textoCorreo}>
            <Text style={styles.label}>Nacionalidad:</Text>
          </View>
          <View style={styles.inputcorreo}>
            <View width={"90%"}>
              <Picker
                selectedValue={pais}
                onValueChange={(itemValue, itemIndex) => setPais(itemValue)}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Chile" value="Chile" />
                <Picker.Item label="Extranjero" value="Extranjero" />
              </Picker>
            </View>
            <FontAwesome
              name="check"
              size={14}
              fill={true}
              color={errores.nacionalidad ? COLORS.greenM : COLORS.verdeclaro}
              marginRight={"4%"}
            />
          </View>
          {errores.nacionalidad ? (
            <Text style={styles.inputErrors}>Introduce una nacionalidad</Text>
          ) : null}
        </View>
        <View style={styles.containercorreo}>
          <View style={styles.textoCorreo}>
            <Text style={styles.label}>RUT:</Text>
          </View>
          <View style={styles.inputcorreo}>
            <View width={"90%"}>
              <Input
                id="user"
                label="Usuario"
                setInput={setRutNuevo}
                value={rut}
                keyboardType="default"
              />
            </View>
            <FontAwesome
              name="check"
              size={14}
              fill={true}
              color={errores.rut ? COLORS.greenM : COLORS.verdeclaro}
              marginRight={"4%"}
            />
          </View>
          {errores.rut ? (
            <Text style={styles.inputErrors}>Introduce un rut válido</Text>
          ) : null}
        </View>
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
            <FontAwesome
              name="check"
              size={14}
              fill={true}
              color={errores.email ? COLORS.greenM : COLORS.verdeclaro}
              marginRight={"4%"}
            />
          </View>
          {errores.email ? (
            <Text style={styles.inputErrors}>Introduce un email válido</Text>
          ) : null}
        </View>
        <View style={styles.conteinerpass}>
          <View style={styles.textoPass}>
            <Text style={styles.label}>Contraseña:</Text>
          </View>
          <View style={styles.inputpass}>
            <View width={"90%"}>
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
            <FontAwesome
              name="check"
              size={14}
              fill={true}
              color={
                isPassValid.touched && !isPassValid.isValid
                  ? COLORS.greenM
                  : COLORS.verdeclaro
              }
              marginRight={"4%"}
            />
            {isPassValid.touched && !isPassValid.isValid && (
              <Text style={styles.inputErrors}>
                Mínimo 8 caracteres, mayúsculas y minúsculas
              </Text>
            )}
          </View>
        </View>
        <View style={styles.conteinerpass}>
          <View style={styles.textoPass}>
            <Text style={styles.label}>Confirmación Contraseña:</Text>
          </View>
          <View style={styles.inputpass}>
            <View width={"90%"}>
              <Input
                id="pass"
                label="Clave"
                minLength={8}
                secureTextEntry
                setInput={setConfirmPass}
                value={confirmPass}
              />
            </View>
            <FontAwesome
              name="check"
              size={14}
              fill={true}
              color={errores.confirmPass ? COLORS.greenM : COLORS.verdeclaro}
              marginRight={"4%"}
            />
            </View>
            {errores.confirmPass && (
              <Text style={styles.inputErrors}>Contraseñas no coinciden</Text>
            )}
          
        </View>
      </View>
      <View style={styles.boton}>
        <View style={styles.Ingresar}>
          <TouchableOpacity
            style={styles.buttonIngresar}
            activeOpacity={0.8}
            onPress={onSignUpHandler}
          >
            <Text style={styles.IngresarText}>REGISTRAR</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.Registro}>
          <View style={styles.crearCuenta}>
            <Text style={styles.labelcuenta}>Ya tienes cuenta?</Text>
          </View>
          <TouchableOpacity
            style={styles.buttonRegistro}
            activeOpacity={0.8}
            onPress={onLogInHandler}
          >
            <Text style={styles.RegistroText}>Ingresa Aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Registro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "15%",
    paddingHorizontal: "5%",
    backgroundColor: COLORS.back,
    alignContent: "center",
  },
  containerTitle: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: COLORS.greenM,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 2,
    fontFamily: "NotoSansMyanmar_400Regular",
  },
  subtitle: {
    color: COLORS.grey,
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "NotoSansMyanmar_400Regular",
  },
  containerlogin: {
    marginTop: "2%",
    height: "80%",
    alignSelf: "center",
    width: "100%",
  },
  textoCorreo: {
    width: "90%",
  },
  containercorreo: {
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    height: "12%",
  },
  butonFecha: {
    backgroundColor: COLORS.verdeclaro,
    textAlign: "center",
    width: "93%",
    height: "54%",
    borderRadius: 10,
    marginTop: "1%",
    marginLeft: 12,
    fontFamily: "NotoSansMyanmar_400Regular"
  },
  inputcorreo: {
    backgroundColor: COLORS.verdeclaro,
    textAlign: "center",
    width: "93%",
    height: 40,
    borderRadius: 10,
    marginTop: "1%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conteinerpass: {
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    height: "12%",

  },
  textoPass: {
    width: "90%",
    marginTop: "5%",
  },
  inputErrors: {
    color: COLORS.falso,
    textAlign: "center",
    fontFamily: "NotoSansMyanmar_300Light",
    fontSize: 12,
    marginTop: "-1%",
  },
  inputpass: {
    backgroundColor: COLORS.verdeclaro,
    textAlign: "center",
    width: "93%",
    height: "52%",
    borderRadius: 10,
    marginTop: "1%",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: COLORS.greenM,
    fontSize: 15,
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontWeight: "bold",
  },
  boton: {
    marginTop: "2%",
    height: "11%",
    alignSelf: "center",
    width: "100%",
  },
  Ingresar: {
    justifyContent: "space-around",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIngresar: {
    backgroundColor: COLORS.greenM,
    width: "65%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: "70%",
  },
  IngresarText: {
    color: "#ffffff",
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 16,
    letterSpacing: 1.5,
    fontWeight: "bold",
  },
  Registro: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "52%",
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
});
