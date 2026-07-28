import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import Input from "../components/input";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../context/AuthContext";
import {
  responsiveVerticalSize,
  responsiveSize,
  responsiveSpacing,
  responsiveFont,
  responsiveIcon,
} from "../utils/responsive";
import { Calendar, LocaleConfig } from "react-native-calendars";
import MonthYearPickerModal, {
  MESES,
} from "../components/MonthYearPickerModal";

LocaleConfig.locales.es = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene.",
    "Feb.",
    "Mar.",
    "Abr.",
    "May.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dic.",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."],
  today: "Hoy",
};

LocaleConfig.defaultLocale = "es";

const CampoRegistro = ({ label, children, error }) => {
  return (
    <View style={styles.containerCampo}>
      <View style={styles.textoCampo}>
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.inputCampo}>{children}</View>

      <View style={styles.errorContainer}>
        {error ? <Text style={styles.inputErrors}>{error}</Text> : null}
      </View>
    </View>
  );
};

const Registro = () => {
  const { register } = useAuth();

  const [date, setDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [selectorMesAnioVisible, setSelectorMesAnioVisible] = useState(false);

  const [mesCalendario, setMesCalendario] = useState(1);

  const [anioCalendario, setAnioCalendario] = useState(1990);

  const [fechaCalendario, setFechaCalendario] = useState("1990-01-01");

  const [email, setEmail] = useState("juan123@gmail.com");
  const [pass, setPass] = useState("12345678");
  const [confirmPass, setConfirmPass] = useState("12345678");
  const [nombre, setNombre] = useState("juan");
  const [genero, setGenero] = useState("");
  const [pais, setPais] = useState("Chile");
  const [rut, setRut] = useState("11.111.111-1");

  const [errores, setErrores] = useState({});
  const [registrando, setRegistrando] = useState(false);

  const navigation = useNavigation();

  const formatearFechaLocal = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const aceptarMesAnio = (nuevoMes, nuevoAnio) => {
    setMesCalendario(nuevoMes);
    setAnioCalendario(nuevoAnio);

    setFechaCalendario(`${nuevoAnio}-${String(nuevoMes).padStart(2, "0")}-01`);

    setSelectorMesAnioVisible(false);
  };

  const obtenerFechaMaximaNacimiento = () => {
    const fechaMaxima = new Date();

    fechaMaxima.setMonth(fechaMaxima.getMonth() - 6);

    return fechaMaxima;
  };

  const seleccionarFechaNacimiento = (dia) => {
    const [year, month, day] = dia.dateString.split("-").map(Number);

    const nuevaFecha = new Date(year, month - 1, day);

    setDate(nuevaFecha);

    setMesCalendario(month);
    setAnioCalendario(year);

    setFechaCalendario(`${year}-${String(month).padStart(2, "0")}-01`);

    setCalendarVisible(false);

    if (errores.fechaNacimiento) {
      setErrores((erroresActuales) => ({
        ...erroresActuales,
        fechaNacimiento: false,
      }));
    }
  };

  const fechaSeleccionada = date ? formatearFechaLocal(date) : undefined;

  const fechaMaximaNacimiento = formatearFechaLocal(
    obtenerFechaMaximaNacimiento(),
  );

  const validarFecha = () => {
    if (!date) return false;

    const fechaMaximaNacimiento = obtenerFechaMaximaNacimiento();

    return date <= fechaMaximaNacimiento;
  };

  const validarRut = (rut = "") => {
    const rutLimpio = rut
      .trim()
      .replace(/\./g, "")
      .replace(/-/g, "")
      .toUpperCase();

    if (rutLimpio.length < 8) {
      return false;
    }

    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    if (!/^\d+$/.test(cuerpo)) {
      return false;
    }

    if (!/^[0-9K]$/.test(dv)) {
      return false;
    }

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const resultado = 11 - (suma % 11);

    const dvEsperado =
      resultado === 11 ? "0" : resultado === 10 ? "K" : resultado.toString();

    return dv === dvEsperado;
  };

  const validarEmail = (correo = "") => {
    const email = correo.trim().toLowerCase();

    const partes = email.split("@");

    if (partes.length !== 2) return false;

    if (partes[0].length < 3) return false;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
  };

  const validarPassword = (password = "") => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    return regex.test(password);
  };

  const validarCampos = () => {
    const nuevosErrores = {};

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
        nuevosErrores.rut = "Introduce un RUT válido";
      } else if (pais === "Chile" && !validarRut(rut)) {
        nuevosErrores.rut = "Introduce un RUT válido";
      } else if (pais === "Extranjero" && rut.trim().length < 3) {
        nuevosErrores.rut = "Introduce un documento válido";
      }

      if (!validarEmail(email)) {
        nuevosErrores.email = "Correo electrónico inválido";
      }

      // ==============================================
      // VALIDACIÓN DE CONTRASEÑA (ACTIVAR EN PRODUCCIÓN)
      // ==============================================
      //
      // const resultadoPassword = onHandleValidationPassword(pass);
      //
      // if (!resultadoPassword.isValid) {
      //   nuevosErrores.password = true;
      // }

      if (pass !== confirmPass) {
        nuevosErrores.confirmPass = true;
      }
    } catch (error) {
      console.error("Error al validar los campos:", error);
      return false;
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSignUp = async () => {
    const camposValidos = validarCampos();

    if (!camposValidos) {
      return;
    }

    if (registrando) {
      return;
    }

    setRegistrando(true);

    try {
      const fechaFormateada = formatearFechaLocal(date);

      const payload = {
        email: email.trim().toLowerCase(),
        password: pass,
        nombre: nombre.trim(),
        fecha_nacimiento: fechaFormateada,
        genero,
        pais,
        rut: rut.trim(),
      };

      const resultadoRegistro = await register(payload);

      if (resultadoRegistro === "RUT_ALREADY_EXISTS") {
        setErrores((erroresActuales) => ({
          ...erroresActuales,
          rut: "Este RUT ya se encuentra registrado.",
        }));

        return;
      }

      if (resultadoRegistro === "EMAIL_ALREADY_EXISTS") {
        setErrores((erroresActuales) => ({
          ...erroresActuales,
          email: "Este correo electrónico ya se encuentra registrado.",
        }));

        return;
      }

      if (!resultadoRegistro) {
        return;
      }
    } finally {
      setRegistrando(false);
    }
  };

  const onLogInHandler = () => {
    navigation.navigate("Login");
  };

  const displayDate = () => {
    if (!date) {
      return "Selecciona una fecha";
    }

    const opciones = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    return date.toLocaleDateString("es-ES", opciones);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardContainer}
    >
      <Modal
        visible={calendarVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.calendarOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>
                Selecciona tu fecha de nacimiento
              </Text>

              <TouchableOpacity
                onPress={() => setCalendarVisible(false)}
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                <Ionicons
                  name="close-circle"
                  size={responsiveIcon(22)}
                  color={COLORS.grey}
                />
              </TouchableOpacity>
            </View>
            <Calendar
              key={fechaCalendario}
              current={fechaCalendario}
              renderHeader={() => (
                <TouchableOpacity
                  style={styles.calendarMonthHeader}
                  onPress={() => setSelectorMesAnioVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.calendarMonthHeaderText}>
                    {MESES[mesCalendario - 1].label} {anioCalendario}
                  </Text>

                  <Ionicons
                    name="chevron-down"
                    size={responsiveIcon(17)}
                    color={COLORS.greenM}
                  />
                </TouchableOpacity>
              )}
              firstDay={1}
              onMonthChange={(mes) => {
                setMesCalendario(mes.month);
                setAnioCalendario(mes.year);
                setFechaCalendario(mes.dateString);
              }}
              maxDate={fechaMaximaNacimiento}
              onDayPress={seleccionarFechaNacimiento}
              dayComponent={({ date: calendarDate, state }) => {
                const seleccionado =
                  calendarDate.dateString === fechaSeleccionada;

                const deshabilitado = state === "disabled";

                return (
                  <TouchableOpacity
                    disabled={deshabilitado}
                    onPress={() => seleccionarFechaNacimiento(calendarDate)}
                    style={[
                      styles.calendarDay,
                      seleccionado && styles.calendarDaySelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        deshabilitado && styles.calendarDayTextDisabled,
                        seleccionado && styles.calendarDayTextSelected,
                      ]}
                    >
                      {calendarDate.day}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              theme={{
                backgroundColor: COLORS.back,
                calendarBackground: COLORS.back,

                dayTextColor: COLORS.black,
                textDisabledColor: COLORS.grey,

                todayTextColor: COLORS.greenM,

                monthTextColor: COLORS.greenM,
                arrowColor: COLORS.greenM,

                textSectionTitleColor: COLORS.greyM,

                textDayFontFamily: "NotoSansMyanmar_400Regular",
                textMonthFontFamily: "NotoSansMyanmar_700Bold",
                textDayHeaderFontFamily: "NotoSansMyanmar_700Bold",

                textDayFontSize: responsiveFont(14),
                textMonthFontSize: responsiveFont(17),
                textDayHeaderFontSize: responsiveFont(12),
              }}
            />
          </View>
        </View>
      </Modal>

      <MonthYearPickerModal
        visible={selectorMesAnioVisible}
        month={mesCalendario}
        year={anioCalendario}
        onAccept={aceptarMesAnio}
        onClose={() => setSelectorMesAnioVisible(false)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerTitle}>
          <Text style={styles.title}>Registro</Text>
          <Text style={styles.subtitle}>Crea tu cuenta</Text>
        </View>
        <View style={styles.containerlogin}>
          <CampoRegistro
            label="Nombre:"
            error={errores.nombre ? "Introduce un nombre válido" : null}
          >
            <View style={styles.contenidoInput}>
              <Input
                id="nombre"
                label="Usuario"
                setInput={setNombre}
                value={nombre}
                keyboardType="default"
                textAlign="left"
                paddingHorizontal={12}
                fontFamily="NotoSansMyanmar_400Regular"
              />
            </View>
          </CampoRegistro>
          <CampoRegistro
            label="Fecha de Nacimiento:"
            error={
              errores.fechaNacimiento ? "Introduce una fecha válida" : null
            }
          >
            <TouchableOpacity
              style={styles.botonFecha}
              onPress={() => setCalendarVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.textoFecha}>{displayDate()}</Text>

              <Ionicons
                name="calendar-outline"
                size={responsiveIcon(19)}
                color={COLORS.greenM}
              />
            </TouchableOpacity>
          </CampoRegistro>
          <CampoRegistro
            label="Género:"
            error={errores.genero ? "Selecciona un género" : null}
          >
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={genero}
                onValueChange={(itemValue) => setGenero(itemValue)}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Femenino" value="Femenino" />
                <Picker.Item label="Masculino" value="Masculino" />
                <Picker.Item label="LGTBIQ+" value="LGTBIQ+" />
              </Picker>
            </View>
          </CampoRegistro>
          <CampoRegistro
            label="Nacionalidad:"
            error={errores.pais ? "Introduce una nacionalidad" : null}
          >
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={pais}
                onValueChange={(itemValue) => setPais(itemValue)}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Chile" value="Chile" />
                <Picker.Item label="Extranjero" value="Extranjero" />
              </Picker>
            </View>
          </CampoRegistro>
          <CampoRegistro label="RUT:" error={errores.rut ?? null}>
            <View style={styles.contenidoInput}>
              <Input
                id="rut"
                label="Usuario"
                setInput={setRut}
                value={rut}
                keyboardType="default"
                paddingHorizontal={12}
              />
            </View>
          </CampoRegistro>
          <CampoRegistro
            label="Correo electrónico:"
            error={errores.email ?? null}
          >
            <View style={styles.contenidoInput}>
              <Input
                id="email"
                label="Usuario"
                setInput={setEmail}
                value={email}
                keyboardType="email-address"
                paddingHorizontal={12}
              />
            </View>
          </CampoRegistro>
          <CampoRegistro
            label="Contraseña:"
            error={
              errores.password
                ? "Debe tener al menos 8 caracteres, letras y números"
                : null
            }
          >
            <View style={styles.contenidoInput}>
              <Input
                id="password"
                label="Clave"
                minLength={8}
                secureTextEntry
                setInput={setPass}
                value={pass}
                paddingHorizontal={12}
              />
            </View>
          </CampoRegistro>
          <CampoRegistro
            label="Confirmación Contraseña:"
            error={errores.confirmPass ? "Las contraseñas no coinciden" : null}
          >
            <View style={styles.contenidoInput}>
              <Input
                id="confirmPassword"
                label="Clave"
                minLength={8}
                secureTextEntry
                setInput={setConfirmPass}
                value={confirmPass}
                paddingHorizontal={12}
              />
            </View>
          </CampoRegistro>
        </View>
        <View style={styles.boton}>
          <View style={styles.Ingresar}>
            <TouchableOpacity
              style={styles.buttonIngresar}
              activeOpacity={0.8}
              onPress={handleSignUp}
              disabled={registrando}
            >
              <Text style={styles.IngresarText}>
                {registrando ? "REGISTRANDO..." : "REGISTRAR"}
              </Text>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Registro;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: COLORS.back,
  },
  container: {
    flexGrow: 1,
    paddingVertical: "10%",
    paddingHorizontal: "5%",
    backgroundColor: COLORS.back,
    alignContent: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.back,
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
    alignSelf: "center",
    width: "100%",
    paddingTop: "3%",
  },
  boton: {
    paddingTop: "10%",
    height: "10%",
    alignSelf: "center",
    width: "100%",
  },
  Ingresar: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIngresar: {
    backgroundColor: COLORS.greenM,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    height: 46,
  },
  IngresarText: {
    color: "#ffffff",
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontSize: 16,
    letterSpacing: 1.6,
    fontWeight: "bold",
  },
  Registro: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "52%",
    marginTop: -2,
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
  containerCampo: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: responsiveVerticalSize(80),
    width: "95%",
  },
  textoCampo: {
    width: "85%",
  },
  inputCampo: {
    backgroundColor: COLORS.verdeclaro,
    width: "92%",
    height: responsiveVerticalSize(42),
    borderRadius: responsiveSize(10),
    marginTop: responsiveSpacing(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contenidoInput: {
    width: "90%",
  },
  pickerContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    overflow: "hidden",
  },
  calendarOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  picker: {
    width: "100%",
    height: responsiveVerticalSize(50),
    color: COLORS.black,
    marginTop: responsiveVerticalSize(-5),
  },
  botonFecha: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveSpacing(12),
  },
  textoFecha: {
    color: COLORS.black,
    fontSize: responsiveFont(15),
    fontFamily: "NotoSansMyanmar_400Regular",
  },
  label: {
    color: COLORS.greenM,
    fontSize: responsiveFont(15),
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontWeight: "bold",
  },
  inputErrors: {
    color: COLORS.falso,
    textAlign: "center",
    fontFamily: "NotoSansMyanmar_300Light",
    fontSize: responsiveFont(12),
    marginTop: "-1%",
  },
  calendarContainer: {
    backgroundColor: COLORS.back,
    borderTopLeftRadius: responsiveSize(16),
    borderTopRightRadius: responsiveSize(16),
    paddingTop: responsiveVerticalSize(14),
    paddingHorizontal: responsiveSpacing(12),
    paddingBottom: responsiveVerticalSize(22),
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveSpacing(10),
    marginBottom: responsiveVerticalSize(4),
  },

  calendarTitle: {
    color: COLORS.greenM,
    fontSize: responsiveFont(17),
    fontFamily: "NotoSansMyanmar_700Bold",
  },

  calendarDay: {
    width: responsiveSize(31),
    height: responsiveSize(31),
    borderRadius: responsiveSize(16),
    justifyContent: "center",
    alignItems: "center",
  },

  calendarDaySelected: {
    backgroundColor: COLORS.greenM,
  },

  calendarDayText: {
    color: COLORS.black,
    fontSize: responsiveFont(14),
    fontFamily: "NotoSansMyanmar_400Regular",
  },

  calendarDayTextDisabled: {
    color: COLORS.grey,
  },

  calendarDayTextSelected: {
    color: COLORS.back,
    fontFamily: "NotoSansMyanmar_700Bold",
  },
  calendarMonthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: responsiveSpacing(8),
    paddingVertical: responsiveVerticalSize(4),
  },
  calendarMonthHeaderText: {
    color: COLORS.greenM,
    fontSize: responsiveFont(17),
    fontFamily: "NotoSansMyanmar_700Bold",
    marginRight: responsiveSpacing(4),
  },
});
