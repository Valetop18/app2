import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { PieChart, LineChart } from "react-native-gifted-charts";
import Buscador from "../components/Buscador";
import { SearchResults } from "../components/SearchResults";
import { LEYES } from "../data/leyes";
import { BuscadorContext } from "../context/BuscadorContext";
import { msPersonRaisedHand, msBlock  } from "@material-symbols-react-native/outlined-400";
import { MsIcon} from "material-symbols-react-native";
import { reaccionesRepository } from "../infrastructure/ReaccionesRepository";
import { useAuth } from "../context/AuthContext";
import { compromisosRepository } from "../infrastructure/compromisosRepository";
import Ionicons from "@react-native-vector-icons/ionicons";
import { legisladoresRepository } from "../infrastructure/legisladoresRepository";
import { useReacciones } from "../hooks/useReacciones";
import { Skeleton } from "../components/Skeleton";

const coloresPorPartido = {
  DES: COLORS.DES,
  PDG: COLORS.PDG,
  IND: COLORS.IND,
  FA: COLORS.FA,
  PS: COLORS.PS,
  PC: COLORS.PC,
  PPD: COLORS.PPD,
  PL: COLORS.PL,
  PR: COLORS.PR,
  AH: COLORS.AH,
  FRVS: COLORS.FRVS,
  PDC: COLORS.PDC,
  UDI: COLORS.UDI,
  RN: COLORS.RN,
  EVOPOLI: COLORS.EVOPOLI,
  REP: COLORS.PREP,
  PNL: COLORS.PNL,
  PSC: COLORS.PSC,
  DEM: COLORS.DEM,
};

const MODAL_HEIGHT = Dimensions.get("window").height * 0.9;

export const DescripcionSenador = ({ route }) => {
  const { user, circunscripcion } = useAuth();
  const [reacciones, setReacciones] = useState({});
  const { handleLike } = useReacciones(user.id, reacciones, setReacciones);

  const [senador, setSenador] = useState({});
  const [asistencia, setAsistencia] = useState();
  const [votacion, setVotacion] = useState();

  const [comision, setComision] = useState("5");
  const [mocion, setMocion] = useState("15");
  const [proyectos, setProyectos] = useState("3/5");
  const [loading, setLoading] = useState(true);

  const [leyesChilenas, setLeyesChilenas] = useState(LEYES);

  const { search, setSearch } = useContext(BuscadorContext);
  const [reaccion, setReaccion] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const [compromisos, setCompromisos] = useState([]);
  const [dataGrafico, setDataGrafico] = useState([{}]);

  const aprobacion = [
    { value: 20, label: "ENE" },
    { value: 40, label: "FEB" },
    { value: 10, label: "MAR" },
    { value: 50, label: "ABR" },
    { value: 30, label: "MAY" },
    { value: 80, label: "JUN" },
  ];
  const aprobacion2 = [
    { value: 40, label: "ENE" },
    { value: 10, label: "FEB" },
    { value: 50, label: "MAR" },
    { value: 30, label: "ABR" },
    { value: 80, label: "MAY" },
    { value: 60, label: "JUN" },
  ];

  useEffect(() => {
    console.log("query busqueda: ", search);
    filtrarLeyes(search);
  }, [search]);

  const idSenador = route.params?.idSenador;
  const reaccionActual = reacciones[idSenador];

  const getSenador = async () => {
    const data = await legisladoresRepository.getLegisladorById(idSenador);
    console.log("circunscipción senador actual: ", data.senador?.circunscripcion);
    setSenador(data);
  };

  const getCompromisos = async () => {
    const compromisos =
      await compromisosRepository.getCompromisosByLegislador(idSenador);
    const compromisosAgrupados = {};

    compromisos.forEach((compromiso) => {
      const categoria = compromiso.categoria;
      if (!compromisosAgrupados[categoria]) {
        compromisosAgrupados[categoria] = [];
      }

      compromisosAgrupados[categoria].push(compromiso);
    });

    const formateados = Object.keys(compromisosAgrupados).map((categoria) => ({
      titulo: categoria,
      data: compromisosAgrupados[categoria],
    }));

    const mapDataGrafico = compromisos.map((item) => ({
      value: 20,
      color: item.cumplimiento ? COLORS.greenM : COLORS.verdeclaro,
    }));

    formateados.forEach((f) => console.log(f.data));
    setDataGrafico(mapDataGrafico);
    setCompromisos(formateados);
  };

  const getReaccion = async () => {
      const reaccion = await reaccionesRepository.getReaccion(
        user.id,
        idSenador,
        "representante",
      );
      setReacciones({ [idSenador]: reaccion });
    };
  
    const fetchAll = async () => {
      try {
        setLoading(true);
        await Promise.all([getSenador(), getReaccion(), getCompromisos()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchAll();
    }, []);


  const borderColor = coloresPorPartido[senador.partido] || "#000";

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

  const renderGridItem = (item) => {
    return (
      <View style={styles.containerModal1}>
        <Text
          style={{
            color: COLORS.black,
            fontSize: 15,
            fontFamily: "NotoSansMyanmar_700Bold",
            marginLeft: 20,
            lineHeight: 30,
            marginTop: 8,
          }}
        >
          {item.titulo}:
        </Text>

        {item.data.map((compromiso, index) => {
          const dataActual = Array.isArray(compromiso)
            ? compromiso[0]
            : compromiso;

          return (
            <View
              key={dataActual.id || index}
              style={styles.containerCompromiso}
            >
              {dataActual.cumplimiento ? (
                <MaterialIcons
                  name="check-circle"
                  size={15}
                  color={COLORS.greenM}
                  style={{ alignSelf: "center", marginTop: -2 }}
                />
              ) : (
                <Ionicons
                  name="chevron-forward-circle"
                  size={15}
                  color={COLORS.grey}
                  style={{ alignSelf: "center", marginTop: -2 }}
                />
              )}

              <Text
                style={{
                  color: COLORS.black,
                  fontSize: 13,
                  fontFamily: "NotoSansMyanmar_400Regular",
                  lineHeight: 16,
                  textAlign: "justify",
                  marginLeft: 8,
                  marginVertical: 3,
                  width: "96%",
                }}
              >
                {dataActual.descripcion}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      {loading ? (
              <View
                style={{
                  alignSelf: "flex-start",
                  paddingVertical: 18,
                  paddingHorizontal: 10,
                }}
              >
                <View
                  style={{
                    paddingLeft: 40,
                  }}
                >
                  <Skeleton width={250} height={25} borderRadius={4} />
                </View>
                <View
                  style={{
                    marginHorizontal: 15,
                    flexDirection: "row",
                    paddingTop: 15,
                  }}
                >
                  <Skeleton width={100} height={100} borderRadius={100} />
                  <View style={{ marginHorizontal: 15, marginTop: 12 }}>
                    <Skeleton width={120} height={80} borderRadius={4} />
                  </View>
                </View>
                <View style={{ marginHorizontal: 15, marginTop: 12 }}>
                  <Skeleton width={360} height={50} borderRadius={4} />
                </View>
                <View
                  style={{
                    paddingLeft: 30,
                    paddingVertical: 20,
                  }}
                >
                  <Skeleton width={220} height={20} borderRadius={4} />
                </View>
                <View
                  style={{
                    paddingLeft: 15,
                  }}
                >
                  <Skeleton width={360} height={170} borderRadius={4} />
                </View>
              </View>
            ) : (
      <ScrollView contentContainerStyle={styles.back}>
        <View style={styles.principal}>
          <View style={styles.container1}>
            <Text style={styles.title}>{senador.nombre}</Text>
            <TouchableOpacity
              style={styles.favorite}
              onPress={() => {
                if (circunscripcion !== senador.senador?.circunscripcion) return;
                handleLike(idSenador, "like");
              }}
            >
              <MaterialIcons
                name="favorite"
                size={42}
                color={reaccionActual === "like" ? COLORS.greenM : COLORS.grey}
                position={"absolute"}
              />
              <Text style={styles.interes}>36%</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container2}>
            <View>
              <Image
                style={{
                  borderColor,
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  borderWidth: 4,
                }}
                source={{ uri: senador.foto }}
              />
              <Text style={styles.partido}>{senador.partido}</Text>
            </View>
            <View style={styles.estadistica}>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons
                  name="event-available"
                  size={17}
                  color={COLORS.black}
                />
                <Text style={styles.informacion}>{asistencia}% Asistencia</Text>
              </View>
              <View flexDirection={"row"} alignItems={"center"}>
                <MsIcon
                  icon={msPersonRaisedHand}
                  size={18}
                  color={COLORS.black}
                />
                <Text style={styles.informacion}>{votacion}% Votaciones</Text>
              </View>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons
                  name="diversity-2"
                  size={17}
                  color={COLORS.black}
                />
                <Text style={styles.informacion} marginLeft={"1%"}>
                  Conforma {comision} comisiones
                </Text>
              </View>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons name="addchart" size={17} color={COLORS.black} />
                <Text style={styles.informacion}>
                  {mocion} mociones presentadas
                </Text>
              </View>
            </View>
            <View style={styles.datausage}>
              <MaterialIcons
                name="data-usage"
                size={50}
                color={COLORS.verdeclaro}
                position={"absolute"}
              />
              <Text style={styles.data2}>36%</Text>
            </View>
          </View>
          <Text
            style={styles.descripcion}
          >{`${senador.profesion} de ${senador.edad} años. ${senador.trayectoria ? senador.trayectoria : ""}`}</Text>
          <View style={styles.container3}>
            <Text style={styles.title2}>Estadísticas de la gestión.</Text>
          </View>
          <View style={styles.container4}>
            {dataGrafico.length > 0 ? (
              <>
                <View width={90} marginVertical={"5%"} alignSelf={"center"}>
                  <Text style={styles.label}>
                    Avances del programa presentado.
                  </Text>
                </View>
                <TouchableOpacity
                  marginVertical={"1%"}
                  onPress={() => setModalVisible(true)}
                >
                  <PieChart
                    strokeColor={COLORS.back}
                    strokeWidth={1}
                    donut
                    data={dataGrafico}
                    showValuesAsLabels={true}
                    innerRadius={18}
                    radius={45}
                    textSize={18}
                    centerLabelComponent={() => {
                      return (
                        <View>
                          <Text
                            style={{
                              color: COLORS.greenM,
                              fontSize: 14,
                              fontFamily: "NotoSansMyanmar_700Bold",
                            }}
                          >
                            90%
                          </Text>
                        </View>
                      );
                    }}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <View width={'45%'} marginVertical={"1%"} alignSelf={"center"} alignItems={'center'}>
                <View marginVertical={'1%'} top={-6}>
                <MsIcon
                  icon={msBlock}
                  size={18}
                  color={COLORS.greenM}
                />
                </View>
                <Text style={styles.label} width={170} top={-3}>
                  No se encontró programa, propuestas o compromisos de campaña.
                </Text>
              </View>
            )}

            <View>
              <Text style={styles.label} marginVertical={5}>
                Evolución de la opinión pública.
              </Text>
              <View marginVertical={5}>
                <LineChart
                  areaChart
                  height={40}
                  xAxisLength={175}
                  data={aprobacion}
                  data2={aprobacion2}
                  hideDataPoints
                  color={COLORS.greenM}
                  color2={COLORS.verdeclaro}
                  startFillColor2={COLORS.verdeclaro}
                  startFillColor={COLORS.greenM}
                  startOpacity={0.6}
                  startOpacity2={0.8}
                  endFillColor={COLORS.back}
                  endOpacity={0.2}
                  hideRules
                  yAxisColor={COLORS.grey}
                  yAxisThickness={0}
                  xAxisThickness={2}
                  maxValue={100}
                  stepValue={50}
                  initialSpacing={10}
                  spacing={31}
                  yAxisTextStyle={{
                    color: COLORS.black,
                    fontFamily: "NotoSansMyanmar_700Bold",
                    fontSize: 8,
                    marginRight: -12,
                  }}
                  xAxisLabelTextStyle={{
                    color: COLORS.black,
                    fontFamily: "NotoSansMyanmar_700Bold",
                    fontSize: 8,
                    marginLeft: 10,
                  }}
                  xAxisColor={COLORS.grey}
                />
              </View>
            </View>
          </View>
          <View style={styles.container6}>
            <View>
              <View style={styles.container5}>
                <View style={styles.datausage}>
                  <MaterialIcons
                    name="data-usage"
                    size={50}
                    color={COLORS.verdeclaro}
                    position={"absolute"}
                  />
                  <Text style={styles.data2}>3/4</Text>
                </View>
                <View width={130} marginVertical={"3%"}>
                  <Text style={styles.label2}>
                    Proyectos aprobados/presentados
                  </Text>
                </View>
              </View>
              <View style={styles.container5}>
                <View style={styles.datausage}>
                  <MaterialIcons
                    name="data-usage"
                    size={50}
                    color={COLORS.verdeclaro}
                    position={"absolute"}
                  />
                  <Text style={styles.data2}>50%</Text>
                </View>
                <View width={130}>
                  <Text style={styles.label2}>
                    Adherencia al partido político
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.container5}>
                <View style={styles.circulo}>
                  <Text style={styles.data2}>34%</Text>
                </View>
                <View width={140} marginVertical={"3%"} marginLeft={5}>
                  <Text style={styles.label2}>
                    Compatibilidad con el representante
                  </Text>
                </View>
              </View>
              <View style={styles.container5}>
                <View style={styles.circulo}>
                  <Text style={styles.data2}>55</Text>
                </View>
                <View width={145} marginVertical={"3%"} marginLeft={5}>
                  <Text style={styles.label2}>
                    Lugar estadístico de todos los representantes
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.buscador}>
          <Buscador />
        </View>
        <View>
          <SearchResults
            data={leyesChilenas}
            onSelect={() => console.log("click")}
            representante={senador.id}
          />
        </View>
      </ScrollView>
)}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.tituloContainer}>
              <Text style={styles.tituloText}>COMPROMISOS*</Text>
            </View>
            <View style={styles.modalBody}>
              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
              >
                {compromisos.map((compromiso, index) => (
                  <View key={index}>{renderGridItem(compromiso)}</View>
                ))}
              </ScrollView>
            </View>
            <View style={styles.modalFooter}>
              <Text style={styles.comentarioModal}>
                *Extraídos desde los canales oficiales del legislador: webs,
                redes sociales, entrevistas y debates.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  back: {
    flexGrow: 1,
    backgroundColor: COLORS.back,
  },
  principal: {
    marginVertical: "1%",
    marginHorizontal: "2%",
    width: "96%",
    backgroundColor: COLORS.back,
    elevation: 3,
    shadowColor: COLORS.black,
    borderRadius: 10,
  },
  container1: {
    marginLeft: "12%",
    marginTop: "1%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 3.8,
  },
  title: {
    fontSize: 20,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.black,
  },
  comentarioModal: {
    fontSize: 14,
    fontFamily: "NotoSansMyanmar_400Regular",
    color: COLORS.greenM,
    lineHeight: 18,
    textAlign: "right",
  },
  favorite: {
    marginTop: "5%",
    marginRight: "5%",
    alignItems: "center",
    width: 42,
    justifyContent: "center",
  },
  interes: {
    fontSize: 12,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.back,
    marginTop: "-16%",
  },
  title2: {
    fontSize: 15,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.black,
  },
  container3: {
    marginLeft: "5%",
    marginTop: "2%",
  },
  container4: {
    flexDirection: "row",
    marginHorizontal: "2%",
  },
  container5: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: "2%",
  },
  container6: {
    flexDirection: "row",
  },
  descripcion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12,
    textAlign: "justify",
    marginHorizontal: "2%",
    lineHeight: 18,
    top: "1%",
  },
  label: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12.5,
    textAlign: "center",
    lineHeight: 16,
  },
  label2: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12.5,
    textAlign: "auto",
    lineHeight: 16,
  },
  containerInfo: {
    flexDirection: "row",
  },
  estadistica: {
    marginTop: "2%",
    marginLeft: "-5%",
  },
  info: {},
  informacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 13,
    color: COLORS.black,
    maxWidth: "98%",
    marginLeft: "2%",
  },
  datausage: {
    marginTop: "2%",
    marginRight: "1%",
    alignItems: "center",
    width: 52,
    height: 52,
    justifyContent: "center",
  },
  circulo: {
    marginVertical: "4%",
    marginHorizontal: "1%",
    alignItems: "center",
    width: 40,
    height: 40,
    justifyContent: "center",
    backgroundColor: COLORS.verdeclaro,
    borderRadius: 100,
  },
  data2: {
    fontSize: 12,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
  },
  container2: {
    maxWidth: "98%",
    marginHorizontal: "2%",
    flexDirection: "row",
    marginLeft: "5%",
    marginVertical: "0.5%",
    justifyContent: "space-between",
  },
  partido: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 14,
    alignSelf: "center",
    marginTop: "2%",
  },
  keyboardView: {
    flex: 1,
    backgroundColor: COLORS.back
  },
  buscador: {
    width: "96%",
    alignSelf: "center",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "93%",
    maxHeight: MODAL_HEIGHT,
    backgroundColor: COLORS.back,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
  },
  modalBody: {
    flexShrink: 1,
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalScrollContent: {
    paddingVertical: 20,
  },
  modalFooter: {
    paddingVertical: 10,
    marginHorizontal: "4%",
  },

  tituloContainer: {
    height: 60,
    width: "100%",
    backgroundColor: COLORS.greenM,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
    paddingTop: 4,
  },
  tituloText: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 20,
    color: COLORS.back,
    lineHeight: 22,
    letterSpacing: 3,
    alignSelf: "center",
    paddingTop: 2,
  },
  conteiner2: {
    paddingTop: 10,
    flexShrink: 1,
    alignItems: "center",
    alignContent: "center",
  },
  containerModal1: {
    marginHorizontal: "2%",
    alignSelf: "center",
  },
  containerCompromiso: {
    flexDirection: "row",
    marginRight: "6%",
    marginHorizontal: "3%",
  },
});
