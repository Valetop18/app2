import React, { useContext, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { PieChart, LineChart } from "react-native-gifted-charts";
import GridRepresentPartido from "../components/gridRepresentsPartido";
import { LEYES } from "../data/leyes";
import { BuscadorContext } from "../context/BuscadorContext";
import {
  msPersonRaisedHand,
  msCloudUpload,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import { useSelector } from "react-redux";
import { partidosRepository } from "../infrastructure/partidosRepository";
import { useAuth } from "../context/AuthContext";
import { legisladoresRepository } from "../infrastructure/legisladoresRepository";
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

export const EstadisticaPartido = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [diputados, setDiputados] = useState([]);
  const [partido, setPartido] = useState({});
  const partidoId = route.params?.partidoId;
  const [loading, setLoading] = useState(true);
  const [detalleMociones, setDetalleMociones] = useState([]);
  const [modalMocionesVisible, setModalMocionesVisible] = useState(false);
  const [loadingMociones, setLoadingMociones] = useState(false);
  const [representacionPromedio, setRepresentacionPromedio] = useState(0);
  const [totalLikesPartido, setTotalLikesPartido] = useState(0);

  const [mocionesAprobadas, setMocionesAprobadas] = useState({
    aprobadas: 0,
    totalMociones: 0,
    fraccion: "0/0",
  });

  const [cohesionPartido, setCohesionPartido] = useState({
    cohesion: 0,
    votacionesEvaluadas: 0,
  });

  const [compatibilidadPartido, setCompatibilidadPartido] = useState({
    compatibilidad: 0,
    coincidencias: 0,
    totalReacciones: 0,
  });

  const normalizarTexto = (texto = "") =>
    texto.trim().replace(/\s+/g, " ").toLowerCase();

  const cargarDetalleMociones = async () => {
    try {
      setLoadingMociones(true);

      const data =
        await partidosRepository.getDetalleMocionesPartido(partidoId);

      const agrupadas = Object.values(
        data.reduce((acc, row) => {
          const boletin = row.numero_boletin;

          if (!acc[boletin]) {
            acc[boletin] = {
              numeroBoletin: boletin,
              titulo: row.titulo_mocion,
              votaciones: [],
            };
          }

          if (row.id_votacion) {
            acc[boletin].votaciones.push({
              idVotacion: row.id_votacion,
              materia: row.materia,
              materiaResumen: row.materia_resumen,
              articulo: row.articulo,
              articuloResumen: row.articulo_resumen,
              resultado: row.resultado,
              fechaTexto: row.fecha_texto,
              fechaDate: row.fecha_date,
              sesion: row.sesion,
            });
          }

          return acc;
        }, {}),
      );

      const procesadas = agrupadas.map((mocion) => {
        let materiaAnterior = "";
        let articuloAnterior = "";

        return {
          ...mocion,
          votaciones: mocion.votaciones.map((votacion) => {
            const materiaActual =
              votacion.materiaResumen || votacion.materia || "";

            const articuloActual =
              votacion.articuloResumen || votacion.articulo || "";

            const materiaNormalizada = normalizarTexto(materiaActual);
            const articuloNormalizado = normalizarTexto(articuloActual);

            const mostrarMateria =
              materiaNormalizada !== "" &&
              materiaNormalizada !== materiaAnterior;

            const mostrarArticulo =
              articuloNormalizado !== "" &&
              articuloNormalizado !== articuloAnterior;

            materiaAnterior = materiaNormalizada;
            articuloAnterior = articuloNormalizado;

            return {
              ...votacion,
              materiaMostrar: mostrarMateria ? materiaActual : null,
              articuloMostrar: mostrarArticulo ? articuloActual : null,
            };
          }),
        };
      });

      setDetalleMociones(procesadas);
      setModalMocionesVisible(true);
    } catch (error) {
      console.error("Error cargando detalle de mociones:", error);
    } finally {
      setLoadingMociones(false);
    }
  };

  const getTotalLikesPartido = async () => {
    try {
      if (!partidoId) return;

      const total = await partidosRepository.getTotalLikesPartido(partidoId);

      setTotalLikesPartido(total);
    } catch (error) {
      console.error("Error cargando total de likes del partido:", error);

      setTotalLikesPartido(0);
    }
  };

  const getCompatibilidadPartido = async () => {
    try {
      if (!user?.id || !partidoId) return;

      const data = await partidosRepository.getCompatibilidadUsuarioPartido(
        user.id,
        partidoId,
      );

      setCompatibilidadPartido(data);
    } catch (error) {
      console.error("Error cargando compatibilidad con el partido:", error);

      setCompatibilidadPartido({
        compatibilidad: 0,
        coincidencias: 0,
        totalReacciones: 0,
      });
    }
  };

  const [estadisticasGenerales, setEstadisticasGenerales] = useState({
    asistencia: 0,
    participacionVotaciones: 0,
    mocionesPresentadas: 0,
    oficiosPresentados: 0,
  });

  console.log("partido llegada estadistica:", route.params?.partidoId);

  useLayoutEffect(() => {
    // navigation.getParent()?.getParent()?.setOptions({
    //   headerTitle: "Diputadoss",
    // })
  }, [navigation]);

  //useEffect(() => {
  //  checkIfIsSaved();
  //  obtenerLegisladoresPorPartido();
  //}, []);

  const checkIfIsSaved = async () => {
    try {
      const data = await partidosRepository.isSaved(user.id, partidoId);
      setIsSaved(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getMocionesAprobadas = async () => {
    try {
      const data =
        await partidosRepository.getMocionesAprobadasPartido(partidoId);

      setMocionesAprobadas(data);
    } catch (error) {
      console.error("Error cargando mociones aprobadas del partido:", error);

      setMocionesAprobadas({
        aprobadas: 0,
        totalMociones: 0,
        fraccion: "0/0",
      });
    }
  };

  const getEstadisticasGenerales = async () => {
    try {
      const data =
        await partidosRepository.getEstadisticasGeneralesPartido(partidoId);

      setEstadisticasGenerales(data);
    } catch (error) {
      console.error(
        "Error cargando estadísticas generales del partido:",
        error,
      );

      setEstadisticasGenerales({
        asistencia: 0,
        participacionVotaciones: 0,
        mocionesPresentadas: 0,
        oficiosPresentados: 0,
      });
    }
  };

  const getCohesionPartido = async () => {
    try {
      if (!partidoId) return;

      const data = await partidosRepository.getCohesionPartido(partidoId);

      setCohesionPartido(data);
    } catch (error) {
      console.error("Error cargando cohesión del partido:", error);

      setCohesionPartido({
        cohesion: 0,
        votacionesEvaluadas: 0,
      });
    }
  };

  const obtenerLegisladoresPorPartido = async () => {
    try {
      const data =
        await partidosRepository.getEstadisticasDiputadosPartido(partidoId);

      setDiputados(data);

      setRepresentacionPromedio(
        data.length > 0 ? data[0].representacionPromedioPartido : 0,
      );
    } catch (error) {
      console.error(
        "Error cargando diputados y estadísticas del partido:",
        error,
      );

      setDiputados([]);
      setRepresentacionPromedio(0);
    }
  };

  const getPartido = async () => {
    const data = await partidosRepository.getPartidoById(partidoId);
    console.log("Partido actual: ", data);
    setPartido(data);
  };

  const [leyesChilenas, setLeyesChilenas] = useState(LEYES);

  const { search, setSearch } = useContext(BuscadorContext);

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

  const mocionesNoAprobadas = Math.max(
    mocionesAprobadas.totalMociones - mocionesAprobadas.aprobadas,
    0,
  );

  const dataMociones = [
    {
      value: mocionesAprobadas.aprobadas,
      color: COLORS.greenM,
    },
    {
      value: mocionesNoAprobadas,
      color: COLORS.verdeclaro,
    },
  ];

  const renderGridItem = ({ item }) => (
    <GridRepresentPartido
      item={{
        ...item,
        partido: partido.sigla,
      }}
    />
  );

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([
        obtenerLegisladoresPorPartido(),
        checkIfIsSaved(),
        getPartido(),
        getEstadisticasGenerales(),
        getMocionesAprobadas(),
        getCompatibilidadPartido(),
        getCohesionPartido(),
        getTotalLikesPartido(),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const borderColor = coloresPorPartido[partido.sigla] || "#000";

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
              <Text style={styles.title}>{partido.nombre}</Text>
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
                  source={{ uri: partido.foto }}
                />
                <Text style={styles.partido}>{partido.sigla}</Text>
              </View>
              <View style={styles.estadistica}>
                <View style={styles.estadisticaFila}>
                  <MaterialIcons
                    name="event-available"
                    size={20}
                    color={COLORS.black}
                  />

                  <Text style={styles.informacion}>
                    {estadisticasGenerales.asistencia}% Asistencia
                  </Text>
                </View>

                <View style={styles.estadisticaFila}>
                  <MsIcon
                    icon={msPersonRaisedHand}
                    size={20}
                    color={COLORS.black}
                  />

                  <Text style={styles.informacion}>
                    {estadisticasGenerales.participacionVotaciones}% Votaciones
                  </Text>
                </View>

                <View style={styles.estadisticaFila}>
                  <MaterialIcons
                    name="addchart"
                    size={20}
                    color={COLORS.black}
                  />

                  <Text style={styles.informacion}>
                    {estadisticasGenerales.mocionesPresentadas} Mociones
                  </Text>
                </View>

                <View style={styles.estadisticaFila}>
                  <MaterialIcons
                    name="assignment-late"
                    size={20}
                    color={COLORS.black}
                  />

                  <Text style={styles.informacion}>
                    {estadisticasGenerales.oficiosPresentados} Oficios
                  </Text>
                </View>
              </View>
              <View marginRight={10}>
                <View style={styles.favorite}>
                  <MaterialIcons
                    name="favorite"
                    size={42}
                    color={isSaved ? COLORS.greenM : COLORS.greyM}
                    position="absolute"
                  />

                  {totalLikesPartido > 0 && (
                    <Text style={styles.interes}>{totalLikesPartido}</Text>
                  )}
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
            </View>
            <View style={styles.container3}>
              <Text style={styles.title2}>Estadísticas de la gestión.</Text>
            </View>
            <View style={styles.container4}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={cargarDetalleMociones}
                style={styles.mocionesPartidoTouchable}
              >
                <View
                  style={{
                    width: 90,
                    marginVertical: "5%",
                    alignSelf: "center",
                  }}
                >
                  <Text style={styles.label}>
                    Mociones aprobadas/presentadas
                  </Text>
                </View>

                <View style={{ marginVertical: "1%" }}>
                  <PieChart
                    strokeColor={COLORS.back}
                    strokeWidth={1}
                    donut
                    data={dataMociones}
                    showValuesAsLabels={false}
                    innerRadius={18}
                    radius={45}
                    textSize={18}
                    centerLabelComponent={() => (
                      <Text
                        style={{
                          color: COLORS.greenM,
                          fontSize: 14,
                          fontFamily: "NotoSansMyanmar_700Bold",
                        }}
                      >
                        {mocionesAprobadas.fraccion}
                      </Text>
                    )}
                  />
                </View>
              </TouchableOpacity>

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
                      position="absolute"
                    />

                    <Text style={styles.data2}>{representacionPromedio}%</Text>
                  </View>

                  <View style={{ width: 130, marginVertical: "3%" }}>
                    <Text style={styles.label2}>Representación promedio</Text>
                  </View>
                </View>
                <View style={styles.container5}>
                  <View style={styles.datausage}>
                    <MaterialIcons
                      name="data-usage"
                      size={50}
                      color={COLORS.verdeclaro}
                      position="absolute"
                    />

                    <Text style={styles.data2}>
                      {cohesionPartido.cohesion}%
                    </Text>
                  </View>

                  <View style={{ width: 130 }}>
                    <Text style={styles.label2}>Índice de cohesión</Text>
                  </View>
                </View>
              </View>
              <View>
                <View style={styles.container5}>
                  <View style={styles.circulo}>
                    <Text style={styles.data2}>
                      {compatibilidadPartido.compatibilidad}%
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 140,
                      marginVertical: "3%",
                      marginLeft: 5,
                    }}
                  >
                    <Text style={styles.label2}>
                      Compatibilidad con el partido
                    </Text>
                  </View>
                </View>
                <View style={styles.container5}>
                  <View style={styles.circulo}>
                    <Text style={styles.data2}>
                      {partido.rankingEstadistico
                        ? `${partido.rankingEstadistico}`
                        : "-"}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 145,
                      marginVertical: "3%",
                      marginLeft: 5,
                    }}
                  >
                    <Text style={styles.label2}>Ranking nacional</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <FlatList
            data={diputados}
            renderItem={renderGridItem}
            numColumns={1}
            keyExtractor={(item) => item.id.toString()}
          />

          <Modal
            visible={modalMocionesVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalMocionesVisible(false)}
          >
            <View style={styles.overlay}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setModalMocionesVisible(false)}
              />

              <View style={styles.modalMocionesContainer}>
                <View style={styles.tituloContainer}>
                  <Text style={styles.tituloText}>
                    Mociones presentadas por el partido
                  </Text>
                </View>

                {loadingMociones ? (
                  <View style={styles.loadingMociones}>
                    <ActivityIndicator size="large" color={COLORS.greenM} />
                  </View>
                ) : (
                  <FlatList
                    data={detalleMociones}
                    keyExtractor={(item) => item.numeroBoletin}
                    contentContainerStyle={styles.listaMociones}
                    renderItem={({ item }) => (
                      <View style={styles.mocionCard}>
                        <Text style={styles.mocionBoletin}>
                          Boletín N° {item.numeroBoletin}
                        </Text>

                        <Text style={styles.mocionTitulo}>{item.titulo}</Text>

                        {item.votaciones.length === 0 ? (
                          <Text style={styles.mocionSinVotacion}>
                            Aún no registra votaciones.
                          </Text>
                        ) : (
                          item.votaciones.map((votacion) => (
                            <View
                              key={votacion.idVotacion}
                              style={styles.votacionMocion}
                            >
                              <Text style={styles.votacionResultado}>
                                {votacion.resultado || "Sin resultado"}
                              </Text>

                              {votacion.materiaMostrar && (
                                <Text style={styles.votacionMateria}>
                                  {votacion.materiaMostrar}
                                </Text>
                              )}

                              {votacion.articuloMostrar && (
                                <Text style={styles.votacionArticulo}>
                                  {votacion.articuloMostrar}
                                </Text>
                              )}

                              <Text style={styles.votacionSesion}>
                                {votacion.sesion}
                              </Text>

                              <Text style={styles.votacionFecha}>
                                {votacion.fechaTexto}
                              </Text>
                            </View>
                          ))
                        )}
                      </View>
                    )}
                  />
                )}
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
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
    marginLeft: "4%",
    marginTop: "1%",
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
  favorite: {
    marginVertical: "12%",
    alignItems: "center",
    justifyContent: "center",
  },
  estadisticaFila: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  interes: {
    fontSize: 12,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.back,
    marginTop: "-16%",
  },
  mocionesPartidoTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  title2: {
    fontSize: 15,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.black,
  },
  container3: {
    marginLeft: "5%",
  },
  container4: {
    flexDirection: "row",
    marginHorizontal: "2%",
  },
  modalMocionesContainer: {
    width: "90%",
    maxHeight: "88%",
    backgroundColor: COLORS.back,
    borderRadius: 10,
    overflow: "hidden",
  },
  container5: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: "2%",
  },
  container6: {
    flexDirection: "row",
  },
  label: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 16,
  },
  label2: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 13,
    textAlign: "auto",
    lineHeight: 16,
  },
  containerInfo: {
    flexDirection: "row",
  },
  estadistica: {
    marginTop: "1%",
    marginLeft: "-12%",
  },
  info: {},
  informacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,
    maxWidth: "98%",
    marginLeft: "2%",
  },
  datausage: {
    marginTop: "2%",
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
    fontSize: 16,
    color: COLORS.black,
    alignSelf: "center",
    marginTop: "2%",
  },
  keyboardView: {
    flex: 1,
    backgroundColor: COLORS.back,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.48)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  loadingMociones: {
    minHeight: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  modalMocionesContainer: {
    width: "94%",
    maxHeight: "88%",
    backgroundColor: COLORS.back,
    borderRadius: 10,
    overflow: "hidden",

    elevation: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },

  tituloContainer: {
    backgroundColor: COLORS.greenM,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  tituloText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.back,
  },

  listaMociones: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 22,
    backgroundColor: COLORS.back,
  },

  mocionCard: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.verdeclaro,
  },

  mocionBoletin: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 14,
    color: COLORS.greenM,
  },

  mocionTitulo: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.black,
    marginTop: 4,
  },

  mocionSinVotacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 13,
    color: COLORS.greyM,
    marginTop: 8,
  },

  votacionMocion: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.verdeclaro,
  },

  votacionResultado: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 13,
    color: COLORS.greenM,
    textTransform: "uppercase",
  },

  votacionMateria: {
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontSize: 13,
    lineHeight: 17,
    color: COLORS.black,
    marginTop: 4,
  },

  votacionArticulo: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12.5,
    lineHeight: 17,
    color: COLORS.black,
    marginTop: 4,
  },

  votacionSesion: {
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontSize: 12,
    color: COLORS.greyM,
    marginTop: 8,
  },

  votacionFecha: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12,
    color: COLORS.greyM,
  },
});
