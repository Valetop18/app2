import React, { useContext, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { PieChart, LineChart } from "react-native-gifted-charts";
import GridRepresentPartido from "../components/gridRepresentsPartido";
import { BuscadorContext } from "../context/BuscadorContext";
import {
  msPersonRaisedHand,
  msCloudUpload,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import { partidosRepository } from "../infrastructure/partidosRepository";
import { useAuth } from "../context/AuthContext";
import { legisladoresRepository } from "../infrastructure/legisladoresRepository";
import { Skeleton } from "../components/Skeleton";
import Ionicons from "@react-native-vector-icons/ionicons";
import { responsiveWidthScale } from "../utils/responsive";
import Tooltip from "../components/tooltip";
import { TOOLTIPS } from "../components/tooltip";
import { FONTS } from "../constants/fonts";

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

const SEMANAS_VISIBLES_GRAFICO = 8;

const anchoGrafico = responsiveWidthScale(312);

const MODAL_HEIGHT = Dimensions.get("window").height * 0.9;

export const EstadisticaPartido = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [diputados, setDiputados] = useState([]);
  const [partido, setPartido] = useState({});
  const partidoId = route.params?.partidoId;
  const [loading, setLoading] = useState(true);
  const [modalEvolucionVisible, setModalEvolucionVisible] = useState(false);

  const [metricasHistoricas, setMetricasHistoricas] = useState([]);
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

  const formatearFechaGrafico = (fecha) => {
    if (!fecha) return "";

    const [anio, mes, dia] = fecha.split("-");

    return `${dia}/${mes}`;
  };

  const formatearMesAnioGrafico = (fecha) => {
    if (!fecha) return "";

    const [anio, mes] = fecha.split("-");

    const meses = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sept",
      "oct",
      "nov",
      "dic",
    ];

    return `${meses[Number(mes) - 1]} ${anio.slice(-2)}`;
  };
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

  const getMetricasHistoricas = async () => {
    try {
      const data =
        await partidosRepository.getMetricasHistoricasPartido(partidoId);

      setMetricasHistoricas(data);
    } catch (error) {
      console.error("Error cargando métricas históricas del partido:", error);

      setMetricasHistoricas([]);
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

  const { search, setSearch } = useContext(BuscadorContext);

  const dataLikesCompleta = metricasHistoricas.map((item) => ({
    value: Number(item.totalLikes ?? 0),
    label: formatearFechaGrafico(item.fechaSnapshot),
    fechaSnapshot: item.fechaSnapshot,
  }));

  const dataRepresentacionCompleta = metricasHistoricas.map((item) => ({
    value: Number(item.representacionPromedioPartido ?? 0),
    label: formatearFechaGrafico(item.fechaSnapshot),
    fechaSnapshot: item.fechaSnapshot,
  }));

  const dataLikes = dataLikesCompleta.slice(-SEMANAS_VISIBLES_GRAFICO);

  const dataRepresentacion = dataRepresentacionCompleta.slice(
    -SEMANAS_VISIBLES_GRAFICO,
  );

  const obtenerMaximoLikes = (datos) => {
    const maximoReal = Math.max(
      0,
      ...datos.map((item) => Number(item.value) || 0),
    );

    if (maximoReal <= 10) return 10;

    const intervaloBase = Math.ceil(maximoReal / 4);

    let intervaloRedondeado;

    if (intervaloBase <= 10) {
      intervaloRedondeado = Math.ceil(intervaloBase / 5) * 5;
    } else if (intervaloBase <= 100) {
      intervaloRedondeado = Math.ceil(intervaloBase / 10) * 10;
    } else {
      intervaloRedondeado = Math.ceil(intervaloBase / 100) * 100;
    }

    return intervaloRedondeado * 4;
  };

  const maxLikesGrafico = obtenerMaximoLikes(dataLikes);

  const indiceCentralGrafico = Math.floor((dataRepresentacion.length - 1) / 2);

  const dataRepresentacionGraficoPequeno = dataRepresentacion.map(
    (item, index) => {
      const esPrimera = index === 0;
      const esCentral = index === indiceCentralGrafico;
      const esUltima = index === dataRepresentacion.length - 1;

      return {
        ...item,
        label:
          esPrimera || esCentral || esUltima
            ? formatearMesAnioGrafico(item.fechaSnapshot)
            : "",
      };
    },
  );

  const anchoGraficoPequeno = responsiveWidthScale(173);

  const spacingGraficoPequeno =
    dataRepresentacionGraficoPequeno.length > 1
      ? (anchoGraficoPequeno - responsiveWidthScale(24)) /
        (dataRepresentacionGraficoPequeno.length - 1)
      : responsiveWidthScale(40);

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
        getMetricasHistoricas(),
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

  const spacingGrafico =
    dataRepresentacion.length > 1
      ? (anchoGrafico - responsiveWidthScale(36)) /
        (dataRepresentacion.length - 1)
      : responsiveWidthScale(50);

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
            paddingVertical: responsiveWidthScale(18),
            paddingHorizontal: responsiveWidthScale(10),
          }}
        >
          <View
            style={{
              paddingLeft: responsiveWidthScale(40),
            }}
          >
            <Skeleton
              width={responsiveWidthScale(250)}
              height={responsiveWidthScale(25)}
              borderRadius={responsiveWidthScale(4)}
            />
          </View>

          <View
            style={{
              marginHorizontal: responsiveWidthScale(15),
              flexDirection: "row",
              paddingTop: responsiveWidthScale(15),
            }}
          >
            <Skeleton
              width={responsiveWidthScale(100)}
              height={responsiveWidthScale(100)}
              borderRadius={responsiveWidthScale(100)}
            />

            <View
              style={{
                marginHorizontal: responsiveWidthScale(15),
                marginTop: responsiveWidthScale(12),
              }}
            >
              <Skeleton
                width={responsiveWidthScale(120)}
                height={responsiveWidthScale(80)}
                borderRadius={responsiveWidthScale(4)}
              />
            </View>
          </View>

          <View
            style={{
              marginHorizontal: responsiveWidthScale(15),
              marginTop: responsiveWidthScale(12),
            }}
          >
            <Skeleton
              width={responsiveWidthScale(360)}
              height={responsiveWidthScale(50)}
              borderRadius={responsiveWidthScale(4)}
            />
          </View>

          <View
            style={{
              paddingLeft: responsiveWidthScale(30),
              paddingVertical: responsiveWidthScale(20),
            }}
          >
            <Skeleton
              width={responsiveWidthScale(220)}
              height={responsiveWidthScale(20)}
              borderRadius={responsiveWidthScale(4)}
            />
          </View>

          <View
            style={{
              paddingLeft: responsiveWidthScale(15),
            }}
          >
            <Skeleton
              width={responsiveWidthScale(360)}
              height={responsiveWidthScale(170)}
              borderRadius={responsiveWidthScale(4)}
            />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.back}>
          <View style={styles.principal}>
            <View style={styles.container1}>
              <Text
                style={styles.title}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                {partido.nombre}
              </Text>
            </View>
            <View style={styles.container2}>
              <View>
                <Image
                  style={{
                    borderColor,
                    width: responsiveWidthScale(100),
                    height: responsiveWidthScale(100),
                    borderRadius: responsiveWidthScale(100),
                    borderWidth: responsiveWidthScale(4),
                  }}
                  source={{ uri: partido.foto }}
                />
                <Text style={styles.partido}>{partido.sigla}</Text>
              </View>
              <View style={styles.estadistica}>
                <Tooltip text={TOOLTIPS.asistencia.partido}>
                  <View style={styles.estadisticaFila}>
                    <MaterialIcons
                      name="event-available"
                      size={responsiveWidthScale(20)}
                      color={COLORS.black}
                    />
                    <Text style={styles.informacion}>
                      {estadisticasGenerales.asistencia}% Asistencia
                    </Text>
                  </View>
                </Tooltip>
                <Tooltip text={TOOLTIPS.votaciones.partido}>
                  <View style={styles.estadisticaFila}>
                    <MsIcon
                      icon={msPersonRaisedHand}
                      size={responsiveWidthScale(20)}
                      color={COLORS.black}
                    />
                    <Text style={styles.informacion}>
                      {estadisticasGenerales.participacionVotaciones}%
                      Votaciones
                    </Text>
                  </View>
                </Tooltip>
                <Tooltip text={TOOLTIPS.mociones.partido}>
                  <View style={styles.estadisticaFila}>
                    <MaterialIcons
                      name="addchart"
                      size={responsiveWidthScale(20)}
                      color={COLORS.black}
                    />
                    <Text style={styles.informacion}>
                      {estadisticasGenerales.mocionesPresentadas} Mociones
                    </Text>
                  </View>
                </Tooltip>
                <Tooltip text={TOOLTIPS.oficiosPartido}>
                  <View style={styles.estadisticaFila}>
                    <MaterialIcons
                      name="assignment-late"
                      size={responsiveWidthScale(20)}
                      color={COLORS.black}
                    />

                    <Text style={styles.informacion}>
                      {estadisticasGenerales.oficiosPresentados} Oficios
                    </Text>
                  </View>
                </Tooltip>
              </View>
              <View>
                <View style={styles.favorite}>
                  <Ionicons
                    name="heart-circle-outline"
                    size={responsiveWidthScale(36)}
                    color={isSaved ? COLORS.greenM : COLORS.greyM}
                    position="absolute"
                  />

                  {totalLikesPartido > 0 && (
                    <Text style={styles.interes}>{totalLikesPartido}</Text>
                  )}
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
                    width: responsiveWidthScale(90),
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
                    strokeWidth={responsiveWidthScale(1)}
                    donut
                    data={dataMociones}
                    showValuesAsLabels={false}
                    innerRadius={responsiveWidthScale(18)}
                    radius={responsiveWidthScale(45)}
                    textSize={responsiveWidthScale(18)}
                    centerLabelComponent={() => (
                      <Text
                        style={{
                          color: COLORS.greenM,
                          fontSize: Math.max(11, responsiveWidthScale(14)),
                          fontFamily: FONTS.bold,
                        }}
                      >
                        {mocionesAprobadas.fraccion}
                      </Text>
                    )}
                  />
                </View>
              </TouchableOpacity>

              <View marginLeft={"-5%"}>
                <Text
                  style={styles.label}
                  marginVertical={responsiveWidthScale(5)}
                  marginBottom={responsiveWidthScale(10)}
                >
                  Evolución de la opinión pública.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setModalEvolucionVisible(true)}
                >
                  <LineChart
                    areaChart
                    height={responsiveWidthScale(53)}
                    width={anchoGraficoPequeno}
                    data={dataRepresentacionGraficoPequeno}
                    color={COLORS.verdeclaro}
                    thickness={responsiveWidthScale(2)}
                    hideDataPoints
                    curved
                    startFillColor={COLORS.verdeclaro}
                    startOpacity={0.55}
                    endFillColor={COLORS.back}
                    endOpacity={0.08}
                    maxValue={100}
                    noOfSections={2}
                    yAxisColor={COLORS.grey}
                    yAxisThickness={0}
                    yAxisLabelWidth={responsiveWidthScale(15)}
                    formatYLabel={(value) => `${Math.round(Number(value))}`}
                    yAxisTextStyle={{
                      color: COLORS.greyM,
                      fontFamily: FONTS.medium,
                      fontSize: responsiveWidthScale(7.5),
                      width: responsiveWidthScale(15),
                      textAlign: "right",
                      marginRight: responsiveWidthScale(-4),
                    }}
                    yAxisLabelContainerStyle={{
                      paddingLeft: 0,
                      paddingRight: 0,
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                    secondaryData={dataLikes}
                    secondaryLineConfig={{
                      color: COLORS.greenM,
                      thickness: responsiveWidthScale(2),
                      curved: true,
                      hideDataPoints: true,
                      startFillColor: COLORS.greenM,
                      startOpacity: 0.45,
                      endFillColor: COLORS.back,
                      endOpacity: 0.06,
                    }}
                    secondaryYAxis={{
                      maxValue: maxLikesGrafico,
                      noOfSections: 2,
                      yAxisColor: COLORS.grey,
                      yAxisThickness: 0,
                      yAxisLabelWidth: responsiveWidthScale(15),

                      formatYLabel: (value) => `${Math.round(Number(value))}`,

                      yAxisTextStyle: {
                        color: COLORS.greyM,
                        fontFamily: FONTS.medium,
                        fontSize: responsiveWidthScale(7.5),
                        textAlign: "left",
                        marginLeft: responsiveWidthScale(-4),
                      },

                      yAxisLabelContainerStyle: {
                        paddingLeft: 0,
                        paddingRight: 0,
                        marginLeft: 0,
                        marginRight: 0,
                      },
                    }}
                    hideRules
                    xAxisThickness={responsiveWidthScale(1)}
                    xAxisColor={COLORS.grey}
                    xAxisLabelTextStyle={{
                      color: COLORS.greyM,
                      fontFamily: FONTS.medium,
                      fontSize: responsiveWidthScale(7),
                      textAlign: "center",
                      marginTop: responsiveWidthScale(2),
                    }}
                    initialSpacing={responsiveWidthScale(8)}
                    endSpacing={responsiveWidthScale(8)}
                    spacing={spacingGraficoPequeno}
                    disableScroll
                    isAnimated
                    animationDuration={500}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.container6}>
              <View style={styles.columnaEstadistica}>
                <Tooltip text={TOOLTIPS.representaciondistrital.partido}>
                  <View style={styles.container5}>
                    <View style={styles.datausage}>
                      <MaterialIcons
                        name="data-usage"
                        size={responsiveWidthScale(46)}
                        color={COLORS.verdeclaro}
                        position="absolute"
                      />

                      <Text style={styles.data2}>
                        {representacionPromedio}%
                      </Text>
                    </View>

                    <View style={styles.textoEstadistica}>
                      <Text style={styles.label2}>Representación promedio</Text>
                    </View>
                  </View>
                </Tooltip>
                <Tooltip
                  text={TOOLTIPS.cohesionPartido}
                  width={responsiveWidthScale(340)}
                >
                  <View style={styles.container5}>
                    <View style={styles.circulo}>
                      <Text style={styles.data2}>
                        {cohesionPartido.cohesion}%
                      </Text>
                    </View>
                    <View style={styles.textoEstadistica}>
                      <Text style={styles.label2}>Índice de cohesión</Text>
                    </View>
                  </View>
                </Tooltip>
              </View>
              <View style={styles.columnaEstadistica}>
                <Tooltip
                  text={TOOLTIPS.CompatibilidadPartidoUsuario}
                  width={responsiveWidthScale(340)}
                >
                  <View style={styles.container5}>
                    <View style={styles.circulo}>
                      <Text style={styles.data2}>
                        {compatibilidadPartido.compatibilidad}%
                      </Text>
                    </View>
                    <View style={styles.textoEstadistica}>
                      <Text style={styles.label2}>
                        Compatibilidad con el partido
                      </Text>
                    </View>
                  </View>
                </Tooltip>
                <Tooltip
                  text={TOOLTIPS.rankingPartidos}
                  width={responsiveWidthScale(340)}
                >
                  <View style={styles.container5}>
                    <View style={styles.circulo}>
                      <Text style={styles.data2}>
                        {partido.rankingEstadistico
                          ? `${partido.rankingEstadistico}`
                          : "-"}
                      </Text>
                    </View>

                    <View style={styles.textoEstadistica}>
                      <Text style={styles.label2}>Ranking nacional</Text>
                    </View>
                  </View>
                </Tooltip>
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

          <Modal
            visible={modalEvolucionVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalEvolucionVisible(false)}
          >
            <View style={styles.overlay}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setModalEvolucionVisible(false)}
              />

              <View style={styles.modalEvolucionContainer}>
                <View style={styles.modalEvolucionHeader}>
                  <View style={styles.modalEvolucionIcon}>
                    <MaterialIcons
                      name="show-chart"
                      size={responsiveWidthScale(24)}
                      color={COLORS.greenM}
                    />
                  </View>

                  <View style={styles.modalEvolucionTitulos}>
                    <Text style={styles.modalEvolucionTitulo}>
                      Evolución de la opinión pública
                    </Text>

                    <Text style={styles.modalEvolucionSubtitulo}>
                      Historial semanal del partido
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.modalEvolucionCerrar}
                    onPress={() => setModalEvolucionVisible(false)}
                    hitSlop={10}
                  >
                    <Ionicons
                      name="close"
                      size={responsiveWidthScale(18)}
                      color={COLORS.greenM}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalEvolucionLeyenda}>
                  <View style={styles.leyendaItem}>
                    <View
                      style={[
                        styles.leyendaLinea,
                        { backgroundColor: COLORS.verdeclaro },
                      ]}
                    />

                    <View style={styles.leyendaTextos}>
                      <Text style={styles.leyendaTitulo}>
                        Representación promedio
                      </Text>

                      <Text style={styles.leyendaDescripcion}>
                        Promedio de coincidencia con las preferencias de los
                        usuarios.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.leyendaItem}>
                    <View
                      style={[
                        styles.leyendaLinea,
                        { backgroundColor: COLORS.greenM },
                      ]}
                    />

                    <View style={styles.leyendaTextos}>
                      <Text style={styles.leyendaTitulo}>Likes al partido</Text>

                      <Text style={styles.leyendaDescripcion}>
                        Cantidad de usuarios que marcaron al partido como
                        favorito.
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalGraficoContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.modalGraficoScroll}
                  >
                    <LineChart
                      areaChart
                      height={responsiveWidthScale(220)}
                      width={anchoGrafico}
                      data={dataRepresentacion}
                      color={COLORS.verdeclaro}
                      dataPointsColor1={COLORS.verdeclaro}
                      dataPointsRadius={responsiveWidthScale(4)}
                      thickness={responsiveWidthScale(3)}
                      startFillColor={COLORS.verdeclaro}
                      startOpacity={0.55}
                      endFillColor={COLORS.back}
                      endOpacity={0.04}
                      secondaryData={dataLikes}
                      secondaryLineConfig={{
                        color: COLORS.greenM,
                        dataPointsColor: COLORS.greenM,
                        dataPointsRadius: responsiveWidthScale(4),
                        thickness: responsiveWidthScale(3),
                        curved: true,
                        startFillColor: COLORS.greenM,
                        startOpacity: 0.28,
                        endFillColor: COLORS.back,
                        endOpacity: 0.03,
                      }}
                      secondaryYAxis={{
                        maxValue: maxLikesGrafico,
                        noOfSections: 4,
                        yAxisColor: COLORS.grey,
                        yAxisThickness: 0,
                        formatYLabel: (value) => `${Math.round(Number(value))}`,
                        yAxisTextStyle: {
                          ...styles.modalGraficoEjeY,
                          textAlign: "left",
                          marginLeft: responsiveWidthScale(-4),
                        },
                        yAxisLabelWidth: responsiveWidthScale(18),
                        yAxisLabelContainerStyle: {
                          paddingRight: 0,
                          paddingLeft: 0,
                          marginRight: 0,
                          marginLeft: 0,
                        },
                      }}
                      maxValue={100}
                      noOfSections={4}
                      hideRules={false}
                      rulesColor="#E8ECE9"
                      rulesType="dashed"
                      yAxisColor={COLORS.grey}
                      yAxisThickness={0}
                      yAxisTextStyle={{
                        ...styles.modalGraficoEjeY,
                        width: responsiveWidthScale(18),
                        textAlign: "right",
                        marginRight: responsiveWidthScale(-4),
                      }}
                      xAxisThickness={responsiveWidthScale(1)}
                      xAxisColor={COLORS.grey}
                      xAxisLabelTextStyle={styles.modalGraficoEjeX}
                      initialSpacing={responsiveWidthScale(12)}
                      spacing={spacingGrafico}
                      showVerticalLines
                      verticalLinesColor="#F0F2F0"
                      disableScroll
                      isAnimated
                      curved
                      animationDuration={700}
                      yAxisLabelWidth={responsiveWidthScale(18)}
                      endSpacing={responsiveWidthScale(12)}
                      yAxisLabelContainerStyle={{
                        paddingRight: 0,
                        paddingLeft: 0,
                        marginRight: 0,
                        marginLeft: 0,
                      }}
                      formatYLabel={(value) => `${Math.round(Number(value))}`}
                    />
                  </ScrollView>
                </View>

                <View style={styles.modalEvolucionFooter}>
                  <Ionicons
                    name="information-circle-outline"
                    size={responsiveWidthScale(16)}
                    color={COLORS.greyM}
                  />

                  <Text style={styles.modalEvolucionNota}>
                    Los valores corresponden a los snapshots semanales
                    almacenados.
                  </Text>
                </View>
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
    borderRadius: responsiveWidthScale(10),
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
    fontSize: Math.max(11, responsiveWidthScale(20)),
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  favorite: {
    marginTop: responsiveWidthScale(60),
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10%",
  },
  estadisticaFila: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveWidthScale(5),
  },
  interes: {
    fontSize: Math.max(11, responsiveWidthScale(12)),
    fontFamily: FONTS.bold,
    color: COLORS.back,
    marginTop: "-16%",
  },
  mocionesPartidoTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "-5%",
  },
  title2: {
    fontSize: Math.max(11, responsiveWidthScale(15)),
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  container3: {
    marginLeft: "5%",
  },
  container4: {
    flexDirection: "row",
    marginHorizontal: "2%",
    justifyContent: "space-around",
    width: "96%",
  },
  container5: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: responsiveWidthScale(4),
    height: responsiveWidthScale(50),
  },
  container6: {
    flexDirection: "row",
    marginHorizontal: "2%",
    marginVertical: responsiveWidthScale(5),
    marginTop: responsiveWidthScale(6),
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    textAlign: "center",
    lineHeight: responsiveWidthScale(16),
  },
  label2: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    textAlign: "auto",
    lineHeight: responsiveWidthScale(16),
  },
  containerInfo: {
    flexDirection: "row",
  },
  estadistica: {
    marginVertical: "3%",
    marginLeft: "-22%",
  },
  info: {},
  informacion: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(14)),
    color: COLORS.black,
    maxWidth: "98%",
    marginLeft: "3%",
  },
  datausage: {
    alignItems: "center",
    width: responsiveWidthScale(46),
    height: responsiveWidthScale(46),
    justifyContent: "center",
  },
  circulo: {
    marginHorizontal: "1%",
    alignItems: "center",
    width: responsiveWidthScale(40),
    height: responsiveWidthScale(40),
    justifyContent: "center",
    backgroundColor: COLORS.verdeclaro,
    borderRadius: responsiveWidthScale(100),
  },
  data2: {
    fontSize: Math.max(11, responsiveWidthScale(12)),
    fontFamily: FONTS.bold,
    color: COLORS.greenM,
    top: responsiveWidthScale(-1),
  },
  container2: {
    flexDirection: "row",
    marginHorizontal: "2%",
    marginVertical: "0.5%",
    justifyContent: "space-between",
    width: "95%",
  },
  partido: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(16)),
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
    paddingHorizontal: responsiveWidthScale(18),
  },
  loadingMociones: {
    minHeight: responsiveWidthScale(180),
    justifyContent: "center",
    alignItems: "center",
  },
  modalMocionesContainer: {
    width: "94%",
    maxHeight: "88%",
    backgroundColor: COLORS.back,
    borderRadius: responsiveWidthScale(10),
    overflow: "hidden",

    elevation: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: responsiveWidthScale(6),
    },
    shadowOpacity: 0.2,
    shadowRadius: responsiveWidthScale(14),
  },
  columnaEstadistica: {
    flex: 1,
    justifyContent: "space-between",
  },
  textoEstadistica: {
    flex: 1,
    marginLeft: responsiveWidthScale(6),
    justifyContent: "center",
  },
  tituloContainer: {
    backgroundColor: COLORS.greenM,
    paddingHorizontal: responsiveWidthScale(18),
    paddingVertical: responsiveWidthScale(14),
    alignItems: "center",
    justifyContent: "center",
  },
  tituloText: {
    fontSize: Math.max(11, responsiveWidthScale(16)),
    lineHeight: responsiveWidthScale(22),
    fontFamily: FONTS.bold,
    color: COLORS.back,
    textAlign: "center",
  },
  listaMociones: {
    paddingHorizontal: responsiveWidthScale(14),
    paddingTop: responsiveWidthScale(14),
    paddingBottom: responsiveWidthScale(22),
    backgroundColor: COLORS.back,
  },
  mocionCard: {
    marginBottom: responsiveWidthScale(16),
    paddingBottom: responsiveWidthScale(14),
    borderBottomWidth: responsiveWidthScale(1),
    borderBottomColor: COLORS.verdeclaro,
  },
  mocionBoletin: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(14)),
    color: COLORS.greenM,
  },
  mocionTitulo: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(14)),
    lineHeight: responsiveWidthScale(18),
    color: COLORS.black,
    marginTop: responsiveWidthScale(4),
  },
  mocionSinVotacion: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    color: COLORS.greyM,
    marginTop: responsiveWidthScale(8),
  },
  votacionMocion: {
    marginTop: responsiveWidthScale(10),
    padding: responsiveWidthScale(10),
    borderRadius: responsiveWidthScale(8),
    backgroundColor: COLORS.verdeclaro,
  },
  votacionResultado: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    color: COLORS.greenM,
    textTransform: "uppercase",
  },
  votacionMateria: {
    fontFamily: FONTS.medium,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    lineHeight: responsiveWidthScale(17),
    color: COLORS.black,
    marginTop: responsiveWidthScale(4),
  },
  votacionArticulo: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(12.5)),
    lineHeight: responsiveWidthScale(17),
    color: COLORS.black,
    marginTop: responsiveWidthScale(4),
  },
  votacionSesion: {
    fontFamily: FONTS.medium,
    fontSize: Math.max(11, responsiveWidthScale(12)),
    color: COLORS.greyM,
    marginTop: responsiveWidthScale(8),
  },
  votacionFecha: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(12)),
    color: COLORS.greyM,
  },
  modalEvolucionContainer: {
    width: "94%",
    maxHeight: MODAL_HEIGHT,
    backgroundColor: COLORS.back,
    borderRadius: responsiveWidthScale(14),
    overflow: "hidden",

    elevation: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: responsiveWidthScale(6),
    },
    shadowOpacity: 0.2,
    shadowRadius: responsiveWidthScale(14),
  },
  modalEvolucionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsiveWidthScale(16),
    paddingVertical: responsiveWidthScale(14),
    borderBottomWidth: responsiveWidthScale(1),
    borderBottomColor: "#E8ECE9",
  },
  modalEvolucionIcon: {
    width: responsiveWidthScale(42),
    height: responsiveWidthScale(42),
    borderRadius: responsiveWidthScale(21),
    backgroundColor: COLORS.verdeclaro,
    alignItems: "center",
    justifyContent: "center",
    marginRight: responsiveWidthScale(12),
  },
  modalEvolucionTitulos: {
    flex: 1,
    paddingRight: responsiveWidthScale(8),
  },
  modalEvolucionTitulo: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(16)),
    lineHeight: responsiveWidthScale(21),
    color: COLORS.black,
  },
  modalEvolucionSubtitulo: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(12.5)),
    lineHeight: responsiveWidthScale(17),
    color: COLORS.greyM,
    marginTop: responsiveWidthScale(1),
  },
  modalEvolucionCerrar: {
    width: responsiveWidthScale(32),
    height: responsiveWidthScale(32),
    borderRadius: responsiveWidthScale(16),
    backgroundColor: COLORS.verdeclaro,
    alignItems: "center",
    justifyContent: "center",
  },
  modalEvolucionLeyenda: {
    paddingHorizontal: responsiveWidthScale(16),
    paddingTop: responsiveWidthScale(14),
    paddingBottom: responsiveWidthScale(4),
  },
  leyendaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: responsiveWidthScale(12),
  },
  leyendaLinea: {
    width: responsiveWidthScale(24),
    height: responsiveWidthScale(4),
    borderRadius: responsiveWidthScale(4),
    marginTop: responsiveWidthScale(8),
    marginRight: responsiveWidthScale(10),
  },
  leyendaTextos: {
    flex: 1,
  },
  leyendaTitulo: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    lineHeight: responsiveWidthScale(17),
    color: COLORS.black,
  },
  leyendaDescripcion: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(11.5)),
    lineHeight: responsiveWidthScale(16),
    color: COLORS.greyM,
    marginTop: responsiveWidthScale(1),
  },
  modalGraficoContainer: {
    marginHorizontal: responsiveWidthScale(12),
    marginTop: responsiveWidthScale(4),
    paddingTop: responsiveWidthScale(8),
    paddingBottom: responsiveWidthScale(4),
    borderRadius: responsiveWidthScale(10),
    backgroundColor: COLORS.back,
    overflow: "hidden",
  },
  modalGraficoScroll: {
    paddingHorizontal: 0,
    paddingBottom: responsiveWidthScale(4),
  },
  modalGraficoEjeY: {
    fontFamily: FONTS.medium,
    fontSize: responsiveWidthScale(9),
    color: COLORS.greyM,
  },
  modalGraficoEjeX: {
    fontFamily: FONTS.medium,
    fontSize: responsiveWidthScale(9),
    color: COLORS.greyM,
    textAlign: "center",
    marginTop: responsiveWidthScale(4),
  },
  modalEvolucionFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: responsiveWidthScale(16),
    marginTop: responsiveWidthScale(8),
    marginBottom: responsiveWidthScale(16),
    paddingHorizontal: responsiveWidthScale(10),
    paddingVertical: responsiveWidthScale(9),
    borderRadius: responsiveWidthScale(8),
    backgroundColor: COLORS.verdeclaro,
  },
  modalEvolucionNota: {
    flex: 1,
    marginLeft: responsiveWidthScale(6),
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(11)),
    lineHeight: responsiveWidthScale(15),
    color: COLORS.greyM,
  },
});
