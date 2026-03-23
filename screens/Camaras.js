import React, { useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { COLORS } from "../constants/colors";
import { Desk } from "../components/desk";
import { InfoPartido } from "../components/infoPartido";
import { BuscadorContext } from "../context/BuscadorContext";
import { SearchResults } from "../components/SearchResults";
import {
  msCalendarMonth,
  msPersonRaisedHand,
  msCloudUpload,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { LEYES } from "../data/leyes";
import Ionicons from "@react-native-vector-icons/ionicons";
import { FlatList } from "react-native-gesture-handler";
import { representantePorPartido } from "../store/actions/representante.action";
import RepresentantePartido from "../components/representantePartido";
import { useNavigation } from "@react-navigation/native";
import {
  seleccionPartido,
  filteredDiputadosPartido,
} from "../store/actions/partido.action";
import { TouchableWithoutFeedback } from "react-native";
import { legisladoresRepository } from "../infrastructure/legisladoresRepository";

export const CamaraDipu = () => {
  const { search, setSearch } = useContext(BuscadorContext);
  const [leyActual, setLeyActual] = useState({ fecha: "", nombre: "" });
  const [botonActivo, setBotonActivo] = useState(0);
  const [hoyActivo, setHoyActivo] = useState(true);
  const [habilitarTransicion, setHabilitarTransicion] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState({
    tipo: "",
    partido: "",
    partidoId: "",
    porcentaje: "",
    tiempo: "",
    representantes: [],
  });
  const [legisladores, setLegisladores] = useState([]);


  const coloresPorPartido = {
    DES: COLORS.DES,
    AM: COLORS.AM,
    PDG: COLORS.PDG,
    IND: COLORS.IND,
    PEV: COLORS.PEV,
    FA: COLORS.FA,
    PS: COLORS.PS,
    PC: COLORS.PC,
    PPD: COLORS.PPD,
    PL: COLORS.PL,
    PR: COLORS.PR,
    AH: COLORS.AH,
    FRVS: COLORS.FRVS,
    DC: COLORS.PDC,
    UDI: COLORS.UDI,
    RN: COLORS.RN,
    EVOPOLI: COLORS.EVOPOLI,
    PREP: COLORS.PREP,
    PNL: COLORS.PNL,
    PSC: COLORS.PSC,
    DEM: COLORS.DEM,
  };


  const partidos = [
  { id: 1, partido: "DEM" },
  { id: 2, partido: "EVOPOLI" },
  { id: 3, partido: "FA" },
  { id: 4, partido: "FRVS" },
  { id: 5, partido: "PC" },
  { id: 6, partido: "PDC" },
  { id: 7, partido: "PDG" },
  { id: 8, partido: "PL" },
  { id: 9, partido: "PNL" },
  { id: 10, partido: "PPD" },
  { id: 11, partido: "PR" },
  { id: 12, partido: "PREP" },
  { id: 13, partido: "PS" },
  { id: 14, partido: "PSC" },
  { id: 15, partido: "RN" },
  { id: 16, partido: "UDI" },
  { id: 17, partido: "IND" }
];


  const diputados = [
    {
      radio: 95,
      cantidad: [
        { id: 0, partido: "PL" },
        { id: 1, partido: "PL" },
        { id: 2, partido: "PC" },
        { id: 3, partido: "PC" },
        { id: 4, partido: "PC" },
        { id: 5, partido: "FA" },
        { id: 6, partido: "FA" },
        { id: 7, partido: "IND" },
        { id: 8, partido: "RN" },
        { id: 9, partido: "RN" },
        { id: 10, partido: "RN" },
        { id: 11, partido: "RN" },
        { id: 12, partido: "PREP" },
        { id: 13, partido: "PREP" },
        { id: 14, partido: "PREP" },
        { id: 15, partido: "PREP" },
      ],
    },
    {
      radio: 120,
      cantidad: [
        { id: 16, partido: "PL" },
        { id: 17, partido: "PPD" },
        { id: 18, partido: "PC" },
        { id: 19, partido: "PC" },
        { id: 20, partido: "PC" },
        { id: 21, partido: "PC" },
        { id: 22, partido: "FA" },
        { id: 23, partido: "FA" },
        { id: 24, partido: "PDG" },
        { id: 25, partido: "PDG" },
        { id: 26, partido: "RN" },
        { id: 27, partido: "RN" },
        { id: 28, partido: "RN" },
        { id: 29, partido: "RN" },
        { id: 30, partido: "RN" },
        { id: 31, partido: "PREP" },
        { id: 32, partido: "PREP" },
        { id: 33, partido: "PREP" },
        { id: 34, partido: "PREP" },
        { id: 35, partido: "PREP" },
      ],
    },
    {
      radio: 145,
      cantidad: [
        { id: 36, partido: "PPD" },
        { id: 37, partido: "PPD" },
        { id: 38, partido: "PC" },
        { id: 39, partido: "PC" },
        { id: 40, partido: "PC" },
        { id: 41, partido: "PC" },
        { id: 42, partido: "FA" },
        { id: 43, partido: "FA" },
        { id: 44, partido: "FA" },
        { id: 45, partido: "FA" },
        { id: 46, partido: "PDG" },
        { id: 47, partido: "PDG" },
        { id: 48, partido: "PDG" },
        { id: 49, partido: "UDI" },
        { id: 50, partido: "RN" },
        { id: 51, partido: "RN" },
        { id: 52, partido: "RN" },
        { id: 53, partido: "RN" },
        { id: 54, partido: "PREP" },
        { id: 55, partido: "PREP" },
        { id: 56, partido: "PREP" },
        { id: 57, partido: "PREP" },
        { id: 58, partido: "PREP" },
        { id: 59, partido: "PREP" },
      ],
    },
    {
      radio: 170,
      cantidad: [
        { id: 60, partido: "PPD" },
        { id: 61, partido: "PPD" },
        { id: 62, partido: "PS" },
        { id: 63, partido: "PS" },
        { id: 64, partido: "PS" },
        { id: 65, partido: "PDC" },
        { id: 66, partido: "PDC" },
        { id: 67, partido: "FA" },
        { id: 68, partido: "FA" },
        { id: 69, partido: "FA" },
        { id: 70, partido: "FA" },
        { id: 71, partido: "PDG" },
        { id: 73, partido: "PDG" },
        { id: 74, partido: "PDG" },
        { id: 75, partido: "PDG" },
        { id: 76, partido: "UDI" },
        { id: 77, partido: "UDI" },
        { id: 78, partido: "UDI" },
        { id: 79, partido: "UDI" },
        { id: 80, partido: "UDI" },
        { id: 81, partido: "PNL" },
        { id: 82, partido: "PNL" },
        { id: 83, partido: "PREP" },
        { id: 84, partido: "PREP" },
        { id: 85, partido: "PREP" },
        { id: 86, partido: "PREP" },
        { id: 87, partido: "PREP" },
        { id: 88, partido: "PREP" },
      ],
    },
    {
      radio: 195,
      cantidad: [
        { id: 89, partido: "PPD" },
        { id: 90, partido: "PPD" },
        { id: 91, partido: "PS" },
        { id: 92, partido: "PS" },
        { id: 93, partido: "PS" },
        { id: 94, partido: "PS" },
        { id: 95, partido: "PDC" },
        { id: 96, partido: "PDC" },
        { id: 97, partido: "PDC" },
        { id: 98, partido: "FA" },
        { id: 99, partido: "FA" },
        { id: 100, partido: "FA" },
        { id: 101, partido: "FRVS" },
        { id: 102, partido: "PDG" },
        { id: 103, partido: "PDG" },
        { id: 104, partido: "PDG" },
        { id: 105, partido: "UDI" },
        { id: 106, partido: "UDI" },
        { id: 107, partido: "UDI" },
        { id: 108, partido: "UDI" },
        { id: 109, partido: "UDI" },
        { id: 110, partido: "UDI" },
        { id: 111, partido: "UDI" },
        { id: 112, partido: "PNL" },
        { id: 113, partido: "PNL" },
        { id: 114, partido: "PNL" },
        { id: 115, partido: "PREP" },
        { id: 116, partido: "PREP" },
        { id: 117, partido: "PREP" },
        { id: 118, partido: "PREP" },
        { id: 119, partido: "PREP" },
        { id: 120, partido: "PSC" },
      ],
    },
    {
      radio: 220,
      cantidad: [
        { id: 121, partido: "PPD" },
        { id: 123, partido: "PPD" },
        { id: 124, partido: "PS" },
        { id: 125, partido: "PS" },
        { id: 126, partido: "PS" },
        { id: 127, partido: "PS" },
        { id: 128, partido: "PDC" },
        { id: 129, partido: "PDC" },
        { id: 130, partido: "PDC" },
        { id: 131, partido: "PR" },
        { id: 132, partido: "PR" },
        { id: 133, partido: "FA" },
        { id: 134, partido: "FA" },
        { id: 135, partido: "FRVS" },
        { id: 136, partido: "FRVS" },
        { id: 137, partido: "PDG" },
        { id: 138, partido: "PDG" },
        { id: 139, partido: "DEM" },
        { id: 140, partido: "UDI" },
        { id: 141, partido: "UDI" },
        { id: 142, partido: "UDI" },
        { id: 143, partido: "UDI" },
        { id: 144, partido: "UDI" },
        { id: 145, partido: "EVOPOLI" },
        { id: 146, partido: "EVOPOLI" },
        { id: 147, partido: "PNL" },
        { id: 148, partido: "PNL" },
        { id: 149, partido: "PNL" },
        { id: 150, partido: "PREP" },
        { id: 151, partido: "PREP" },
        { id: 152, partido: "PREP" },
        { id: 153, partido: "PREP" },
        { id: 154, partido: "PREP" },
        { id: 155, partido: "PSC" },
        { id: 156, partido: "PSC" },
      ],
    },
  ];

  const [leyesChilenas, setLeyesChilenas] = useState(LEYES);
  const pelotas = [];
  const infoPartidos = [];
  const partidosCoordenadas = [];
  const dispatch = useDispatch();

  {
    diputados.map((fila, index) => {
      for (let i = 0; i < fila.cantidad.length; i++) {
        //calcular angulo de cada pelota
        const anguloEnRadianes =
          Math.PI * 1.205 * (i / (fila.cantidad.length - 1)) + 1.25;

        const cartX = fila.radio * Math.cos(anguloEnRadianes);
        const cartY = fila.radio * Math.sin(anguloEnRadianes);

        const posicionX = 250 + cartX - 10;
        const posicionY = 250 - cartY - 10;

        const partido = fila.cantidad[i].partido;

        const dataPartido = {
          nombre: partido,
          coordenadas: [posicionX, posicionY],
        };

        partidosCoordenadas.push(dataPartido);

        const pelota = (
          <Desk
            partido={partido}
            left={posicionX}
            top={posicionY}
            key={fila.cantidad[i].id}
          />
        );
        pelotas.push(pelota);
      }
    });
  }

  const partidosAgrupados = {};
  partidosCoordenadas.forEach((item) => {
    const { nombre, coordenadas } = item;
    if (!partidosAgrupados[nombre]) {
      partidosAgrupados[nombre] = [];
    }
    partidosAgrupados[nombre].push(coordenadas);
  });

  const promediosPartidos = {};

  for (const partido in partidosAgrupados) {
    const coordenadas = partidosAgrupados[partido];
    if (coordenadas.length > 1) {
      //contadores para sumar
      let sumX = 0;
      let sumY = 0;

      coordenadas.forEach((par) => {
        //[123, 431]
        sumX += par[0];
        sumY += par[1];
      });

      const promedioX = (sumX / coordenadas.length).toFixed(5);
      const promedioY = (sumY / coordenadas.length).toFixed(5);

      promediosPartidos[partido] = [promedioX, promedioY];
    } else {
      const x = coordenadas[0][0];
      const y = coordenadas[0][1];
      promediosPartidos[partido] = [x, y];
    }
  }

  const obtenerLegisladoresPorPartido = async (partidoId) => {

    try {
      const data = await legisladoresRepository.getDiputadosByPartido(partidoId);
      setLegisladores(data);
    } catch (error) {
      console.error(error);
    }

  }

  for (const partido in promediosPartidos) {
    const [posicionX, posicionY] = promediosPartidos[partido];
    const id = `${partido}-${posicionX}-${posicionY}`;


    const partidoId = partidos.find( p => p.partido === partido ).id;
    

    let infoPartido;

    switch (botonActivo) {
      case 0:
      case 1:
        infoPartido = (
          <InfoPartido
            partido={partido}
            porcentajeAsistencia={"60%"}
            left={posicionX - 18}
            top={posicionY - 18}
            key={id}
            onPress={() => {
              obtenerLegisladoresPorPartido(partidoId);
              setModalVisible(true);
              setInfoModal((prevState) => ({
                ...prevState,
                tipo: "Asistencia",
                partido,
                partidoId,
                porcentaje: "60%",
                tiempo: "Hoy",
              }));
            }}
          />
        );
        break;

      case 2:
        infoPartido = (
          <InfoPartido
            partido={partido}
            porcentajeVotacion={"30%"}
            left={posicionX - 18}
            top={posicionY - 18}
            key={id}
            onPress={() => {
              obtenerLegisladoresPorPartido(partidoId);
              setModalVisible(true);
              setInfoModal((prevState) => ({
                ...prevState,
                tipo: "Votación",
                partido,
                partidoId,
                porcentaje: "60%",
                tiempo: "Hoy",
              }));
            }}
          />
        );
        break;

      case 3:
        infoPartido = (
          <InfoPartido
            partido={partido}
            numeroProyectos={50}
            left={posicionX - 18}
            top={posicionY - 18}
            key={id}
            onPress={() => {
              obtenerLegisladoresPorPartido(partidoId);
              setModalVisible(true);
              setInfoModal((prevState) => ({
                ...prevState,
                tipo: "Proyectos",
                partido,
                partidoId,
                porcentaje: "60%",
                tiempo: "Hoy",
              }));
            }}
          />
        );
        break;

      default:
        break;
    }
    infoPartidos.push(infoPartido);
  }

  const handleResultPress = (item) => {
    setSearch("");
    setLeyActual(item);
    setBotonActivo(2);
    setHoyActivo(false);
  };

  const filtrarLeyes = (texto) => {
    const leyesFiltradas = LEYES.filter((ley) => {
      const nombreLey = ley.nombre ? ley.nombre.toUpperCase() : "";
      const descLey = ley.descripcion ? ley.descripcion.toUpperCase() : "";
      const textUpper = texto.toUpperCase();
      return nombreLey.includes(textUpper) || descLey.includes(textUpper);
    });
    setLeyesChilenas(leyesFiltradas);
    return leyesFiltradas;
  };

  useEffect(() => {
    filtrarLeyes(search);
  }, [search]);

  useEffect(() => {
    if (!habilitarTransicion) return;

    if (botonActivo > 3) {
      setHoyActivo(false);
      setBotonActivo(1);
      setHabilitarTransicion(false);
    }

    const timeout = setTimeout(
      () => {
        setBotonActivo((prev) => prev + 1);
      },

      2000,
    );

    return () => clearTimeout(timeout);
  }, [botonActivo, habilitarTransicion]);

  const fechaHoy = new Date().toLocaleDateString("es-CL");

  const handlePress = (botonActivo) => {
    setHabilitarTransicion(false);
    setBotonActivo(botonActivo);
    if (botonActivo === 3) {
      setLeyActual({ fecha: "", nombre: "" });
    }
  };

  const handlePressHoy = () => {
    setHoyActivo(!hoyActivo);
    setLeyActual({ fecha: "", nombre: "" });
  };

  const renderGridItem = ({ item }) => <RepresentantePartido item={item} />;
  const borderColor = coloresPorPartido[infoModal.partido] || "#000";

  const navigation = useNavigation();

  const handlePressNavigate = (partidoEstadistica, partidoId) => {
    dispatch(seleccionPartido(partidoEstadistica));
    dispatch(filteredDiputadosPartido(partidoEstadistica));
    navigation.navigate("EstadisticaPartido", {partidoId} );

  };

  return (
    <View style={styles.container}>
      {search.length > 0 ? (
        <SearchResults data={leyesChilenas} onSelect={handleResultPress} />
      ) : (
        <>
          <View style={styles.informacion}>
            <TouchableOpacity
              style={[styles.containerHoy, hoyActivo && styles.activeButton]}
              onPress={handlePressHoy}
            >
              <MsIcon
                icon={msCalendarMonth}
                size={20}
                color={hoyActivo ? COLORS.back : COLORS.greyM}
              />
              <Text style={[styles.textHoy, hoyActivo && styles.activeText]}>
                Hoy
              </Text>
            </TouchableOpacity>
            <View style={styles.estadistica}>
              <TouchableOpacity
                style={[
                  styles.estadistica2,
                  (botonActivo < 2 || botonActivo === 4) && styles.activeButton,
                ]}
                width={105}
                height={30}
                onPress={() => handlePress(1)}
              >
                <MaterialIcons
                  name="event-available"
                  size={20}
                  color={
                    botonActivo < 2 || botonActivo === 4
                      ? COLORS.back
                      : COLORS.greyM
                  }
                  style={[
                    (botonActivo < 2 || botonActivo === 4) &&
                      styles.activeButton,
                  ]}
                />
                <Text
                  style={[
                    styles.textHoy,
                    (botonActivo < 2 || botonActivo === 4) && styles.activeText,
                  ]}
                >
                  Asistencia
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.estadistica2,
                  botonActivo === 2 && styles.activeButton,
                ]}
                width={112}
                height={30}
                onPress={() => handlePress(2)}
              >
                <MsIcon
                  icon={msPersonRaisedHand}
                  size={20}
                  color={botonActivo === 2 ? COLORS.back : COLORS.greyM}
                />
                <Text
                  style={[
                    styles.textHoy,
                    botonActivo === 2 && styles.activeText,
                  ]}
                >
                  Votaciones
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.estadistica2,
                  botonActivo === 3 && styles.activeButton,
                ]}
                width={104}
                height={30}
                onPress={() => handlePress(3)}
              >
                <MsIcon
                  icon={msCloudUpload}
                  size={20}
                  color={botonActivo === 3 ? COLORS.back : COLORS.greyM}
                />
                <Text
                  style={[
                    styles.textHoy,
                    botonActivo === 3 && styles.activeText,
                  ]}
                >
                  Proyectos
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {leyActual?.fecha !== "" && (
            <Text style={styles.fecha}> {leyActual.fecha} </Text>
          )}

          {leyActual?.nombre !== "" ? null : hoyActivo ? (
            <Text style={styles.fecha}>{hoyActivo && fechaHoy}</Text>
          ) : (
            <Text style={styles.fecha}>PERÍODO ACUMULADO</Text>
          )}

          <Text style={styles.infoEstadistica}>
            {botonActivo < 2 && "Asistencia Total Cámara:"}
            {botonActivo === 4 && "Asistencia Total Cámara:"}
            {botonActivo === 2 && "Votación Total Cámara:"}
            {botonActivo === 3 && "Proyectos Totales Cámara:"}
          </Text>

          <Text style={styles.textInfo}>
            {leyActual?.nombre !== "" && (
              <Text style={styles.textLey}>{leyActual.nombre}:</Text>
            )}
            <Text style={styles.textDescripcion}> {leyActual.descripcion}</Text>
          </Text>

          <View style={styles.camara}>
            {pelotas}
            {infoPartidos}
          </View>

          <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.overlay}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setModalVisible(false)}
              />

              <View style={styles.modalContainer}>
                <View style={styles.tituloContainer}>
                  <View>
                    <Text style={styles.tituloText}>{infoModal.tipo}</Text>
                    <Text style={styles.tituloText}>{infoModal.tiempo}</Text>
                  </View>
                  <MaterialIcons
                    name="event-available"
                    size={50}
                    color={COLORS.back}
                  />
                </View>
                <View style={styles.conteiner2}>
                  <TouchableOpacity
                    style={styles.botonPartido}
                    onPress={() => handlePressNavigate(infoModal.partido, infoModal.partidoId)}
                  >
                    <View
                      style={{
                        width: 55,
                        height: 55,
                        backgroundColor: COLORS.back,
                        borderRadius: 100,
                        borderColor,
                        borderWidth: 3,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.infopartido}>
                        {infoModal.partido}
                      </Text>
                      <Text style={styles.infoPorcentaje}>
                        {infoModal.porcentaje}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.textBoton}>
                        Estadísticas del Partido
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward-circle"
                      size={20}
                      color={COLORS.greenM}
                    />
                  </TouchableOpacity>
                  <FlatList
                    data={legisladores}
                    renderItem={renderGridItem}
                    numColumns={1}
                    scrollEnabled={true}
                    style={{ flexGrow: 0, marginTop: 5, marginVertical: 15 }}
                    keyboardShouldPersistTaps="handled"
                  />
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.back,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "74%",
    maxHeight: "90%",
    backgroundColor: COLORS.back,
    borderRadius: 15,
  },
  pelota: {
    width: 20,
    height: 20,
    borderRadius: 40,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  camara: {
    width: "80%",
    height: "80%",
    position: "absolute",
    marginTop: "38%",
  },
  containerHoy: {
    flexDirection: "row",
    backgroundColor: COLORS.back,
    marginVertical: 10,
    width: 70,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    elevation: 3,
    shadowColor: COLORS.black,
  },
  informacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    paddingTop: 5,
  },
  textHoy: {
    fontSize: 13,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greyM,
    paddingVertical: 0,
    paddingBottom: 0,
    paddingTop: 0,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: COLORS.greenM,
  },
  activeText: {
    color: COLORS.back,
  },
  estadistica: {
    flexDirection: "row",
    alignItems: "center",
  },
  estadistica2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    elevation: 3,
    shadowColor: COLORS.black,
    backgroundColor: COLORS.back,
    paddingHorizontal: 7,
    height: 30,
  },
  fecha: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 14,
    color: COLORS.greenM,
    marginTop: 10,
  },
  infoEstadistica: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 13,
    color: COLORS.greenM,
  },
  textInfo: {
    width: "90%",
    alignSelf: "center",
    textAlign: "justify",
  },
  textLey: {
    fontFamily: "Sedan_400Regular",
    fontSize: 16,
    color: COLORS.greenM,
  },
  textDescripcion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12,
    color: COLORS.black,
    textAlign: "justify",
    marginHorizontal: "2%",
    lineHeight: 18,
  },
  tituloContainer: {
    height: 75,
    width: "100%",
    backgroundColor: COLORS.greenM,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopEndRadius: 15,
    borderTopLeftRadius: 15,
    paddingTop: 4,
  },
  tituloText: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 20,
    color: COLORS.back,
    lineHeight: 22,
    marginRight: 40,
    alignSelf: "center",
    paddingTop: 2,
  },
  conteiner2: {
    paddingTop: 20,
    flexShrink: 1,
    alignItems: "center",
  },
  botonPartido: {
    width: 285,
    height: 72,
    backgroundColor: COLORS.verdeclaro,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
  },
  conteinerPartido: {
    width: 55,
    height: 55,
    backgroundColor: "rgba(255, 255, 255, 0.80)",
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  textBoton: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 15,
    color: COLORS.greenM,
  },
  infopartido: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 10,
    color: COLORS.greenM,
    top: 9,
    lineHeight: 15,
  },
  infoPorcentaje: {
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
    fontSize: 15,
  },
  conteinerRepresentantes: {
    margin: 10,
  },
});
