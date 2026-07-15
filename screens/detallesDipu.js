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
import { COLORS } from "../constants/colors";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { PieChart, LineChart } from "react-native-gifted-charts";
import Buscador from "../components/Buscador";
import { SearchResults } from "../components/SearchResults";
import { LEYES } from "../data/leyes";
import { BuscadorContext } from "../context/BuscadorContext";
import {
  msPersonRaisedHand,
  msBlock,
  msAssignmentLate,
  msAlarm,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import { reaccionesRepository } from "../infrastructure/ReaccionesRepository";
import { useAuth } from "../context/AuthContext";
import { compromisosRepository } from "../infrastructure/compromisosRepository";
import Ionicons from "@react-native-vector-icons/ionicons";
import { legisladoresRepository } from "../infrastructure/legisladoresRepository";
import { useReacciones } from "../hooks/useReacciones";
import { Skeleton } from "../components/Skeleton";
import { votacionesRepository } from "../infrastructure/votacionesRepository";
import Tooltip, { TOOLTIPS } from "../components/tooltip";
import { ActivityIndicator } from "react-native";

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

export const DescripcionDiputado = ({ route }) => {
  const { user, distrito } = useAuth();
  const [reacciones, setReacciones] = useState({});
  const { handleLike } = useReacciones(user.id, reacciones, setReacciones);

  const [diputado, setDiputado] = useState({});
  const [votacion, setVotacion] = useState();
  const [porcentajeVotaciones, setPorcentajeVotaciones] = useState("");
  const [atrasosDiputado, setAtrasosDiputado] = useState("");

  const [proyectos, setProyectos] = useState("3/5");
  const [loading, setLoading] = useState(true);

  const [leyesChilenas, setLeyesChilenas] = useState(LEYES);

  const { search, setSearch } = useContext(BuscadorContext);
  const [reaccion, setReaccion] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const [compromisos, setCompromisos] = useState([]);
  const [dataGrafico, setDataGrafico] = useState([{}]);

  const [ultimasVotaciones, setUltimasVotaciones] = useState([]);
  const [votacionesFiltradas, setVotacionesFiltradas] = useState([]);

  const [idDiputadoCamara, setIdDiputadoCamara] = useState(null);
  const [buscandoVotaciones, setBuscandoVotaciones] = useState(false);
  const [adherenciaPartido, setAdherenciaPartido] = useState("");
  const [mocionesAprobadas, setMocionesAprobadas] = useState("0/0");
  const [totalLikesDiputado, setTotalLikesDiputado] = useState(0);

  const [detalleMociones, setDetalleMociones] = useState([]);
  const [modalMocionesVisible, setModalMocionesVisible] = useState(false);
  const [loadingMociones, setLoadingMociones] = useState(false);
  const [modalEvolucionVisible, setModalEvolucionVisible] = useState(false);

  const [compatibilidadUsuario, setCompatibilidadUsuario] = useState({
    compatibilidad: 0,
    coincidencias: 0,
    totalReacciones: 0,
  });

  const [representacionDistrital, setRepresentacionDistrital] = useState({
    representacion: 0,
    coincidencias: 0,
    totalReacciones: 0,
    usuariosParticipantes: 0,
  });

  const dataLikes = [
    { value: 20, label: "ENE" },
    { value: 40, label: "FEB" },
    { value: 10, label: "MAR" },
    { value: 50, label: "ABR" },
    { value: 30, label: "MAY" },
    { value: 80, label: "JUN" },
  ];
  const dataRepresentacion = [
    { value: 40, label: "ENE" },
    { value: 10, label: "FEB" },
    { value: 50, label: "MAR" },
    { value: 30, label: "ABR" },
    { value: 80, label: "MAY" },
    { value: 60, label: "JUN" },
  ];

  useEffect(() => {
    const texto = search.trim();

    if (!idDiputadoCamara) return;

    if (texto.length < 2) {
      setVotacionesFiltradas(ultimasVotaciones);
      setBuscandoVotaciones(false);
      return;
    }

    setBuscandoVotaciones(true);

    const timeout = setTimeout(async () => {
      try {
        const votaciones = await votacionesRepository.buscarVotaciones(
          texto,
          20,
        );

        const idsVotaciones = votaciones.map((v) => v.id);

        const votos = await votacionesRepository.getVotosDiputadoPorVotaciones(
          idDiputadoCamara,
          idsVotaciones,
        );

        const votosPorVotacion = votos.reduce((acc, v) => {
          acc[v.id_votacion] = v.voto;
          return acc;
        }, {});

        const votacionesConVoto = votaciones.map((v) => ({
          ...v,
          votoRepresentante: votosPorVotacion[v.id] || null,
        }));

        setVotacionesFiltradas(votacionesConVoto);
      } catch (error) {
        console.error("Error buscando votaciones del diputado:", error);
        setVotacionesFiltradas([]);
      } finally {
        setBuscandoVotaciones(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, idDiputadoCamara, ultimasVotaciones]);

  const idDiputado = route.params?.idDiputado;
  const reaccionActual = reacciones[idDiputado];

  const getDiputado = async () => {
    const data = await legisladoresRepository.getLegisladorById(idDiputado);
    const idDiputadoCamara = data?.diputado?.id;
    setIdDiputadoCamara(idDiputadoCamara);
    const atrasosLegislador =
      await legisladoresRepository.getAtrasosDiputado(idDiputadoCamara);
    const porcentajeVotaciones =
      await legisladoresRepository.getParticipacionHistoricaDiputado(
        idDiputadoCamara,
      );
    const adherencia =
      await legisladoresRepository.getAdherenciaDiputadoPartido(
        idDiputadoCamara,
      );
    const mocionesAprobadasData =
      await legisladoresRepository.getMocionesAprobadasDiputado(
        idDiputadoCamara,
      );
    const compatibilidad =
      await legisladoresRepository.getCompatibilidadUsuarioDiputado(
        user.id,
        idDiputadoCamara,
      );
    const representacion =
      await legisladoresRepository.getRepresentacionDistritalDiputado(
        idDiputadoCamara,
      );
    const totalLikes =
      await legisladoresRepository.getTotalLikesRepresentante(idDiputado);

    console.log("diputado detalle: ", data);
    setDiputado(data);
    setMocionesAprobadas(mocionesAprobadasData.fraccion);
    setRepresentacionDistrital(representacion);
    setAdherenciaPartido(adherencia);
    setTotalLikesDiputado(totalLikes);
    setCompatibilidadUsuario(compatibilidad);
    setAtrasosDiputado(atrasosLegislador);
    setPorcentajeVotaciones(porcentajeVotaciones);
    await getUltimasVotaciones(idDiputadoCamara);
  };

  const getCompromisos = async () => {
    const compromisos =
      await compromisosRepository.getCompromisosByLegislador(idDiputado);
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

  const normalizarTexto = (texto = "") => {
    return texto.trim().replace(/\s+/g, " ").toLowerCase();
  };

  const cargarDetalleMociones = async () => {
    if (!idDiputadoCamara) return;

    try {
      setLoadingMociones(true);

      const data =
        await legisladoresRepository.getDetalleMocionesDiputado(
          idDiputadoCamara,
        );

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

      const mocionesProcesadas = agrupadas.map((mocion) => {
        let materiaAnterior = "";
        let articuloAnterior = "";

        const votaciones = mocion.votaciones.map((votacion) => {
          const materiaActual =
            votacion.materiaResumen || votacion.materia || "";

          const articuloActual =
            votacion.articuloResumen || votacion.articulo || "";

          const materiaNormalizada = normalizarTexto(materiaActual);
          const articuloNormalizado = normalizarTexto(articuloActual);

          const mostrarMateria =
            materiaNormalizada !== "" && materiaNormalizada !== materiaAnterior;

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
        });

        return {
          ...mocion,
          votaciones,
        };
      });

      setDetalleMociones(mocionesProcesadas);
      setModalMocionesVisible(true);
    } catch (error) {
      console.error("Error cargando detalle de mociones:", error);
    } finally {
      setLoadingMociones(false);
    }
  };

  const getReaccion = async () => {
    const reaccion = await reaccionesRepository.getReaccion(
      user.id,
      idDiputado,
      "representante",
    );
    setReacciones({ [idDiputado]: reaccion });
  };

  const getUltimasVotaciones = async (idDiputado) => {
    const votaciones = await votacionesRepository.getUltimasVotaciones(
      20,
      idDiputado,
    );
    setUltimasVotaciones(votaciones);
    setVotacionesFiltradas(votaciones);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([getDiputado(), getReaccion(), getCompromisos()]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const borderColor = coloresPorPartido[diputado.partido] || "#000";

  const filtrarVotaciones = (texto) => {
    const filtradas = votacionesRepository.filtrarVotaciones(
      ultimasVotaciones,
      texto,
    );
    setVotacionesFiltradas(filtradas);
    return filtradas;
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
              <Text style={styles.title}>{diputado.nombre}</Text>
              <TouchableOpacity
                style={styles.favorite}
                onPress={async () => {
                  const distritoUsuario = Number(user?.distrito);
                  const distritoDiputado = Number(diputado.diputado?.distrito);

                  if (distritoUsuario !== distritoDiputado) return;

                  const actual = reacciones[idDiputado];
                  const nueva = actual === "like" ? "null" : "like";

                  await handleLike(idDiputado, "like");

                  setReacciones((prev) => ({
                    ...prev,
                    [idDiputado]: nueva,
                  }));

                  setTotalLikesDiputado((prev) => {
                    if (actual !== "like" && nueva === "like") return prev + 1;
                    if (actual === "like" && nueva !== "like")
                      return Math.max(prev - 1, 0);
                    return prev;
                  });
                }}
              >
                <Text style={styles.interes}>
                  {totalLikesDiputado > 0 ? totalLikesDiputado : ""}
                </Text>
                <Ionicons
                  name="heart-circle-outline"
                  size={34}
                  color={
                    reaccionActual === "like" ? COLORS.greenM : COLORS.grey
                  }
                />
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
                  source={{ uri: diputado.foto }}
                />
                <Text style={styles.partido}>
                  {diputado.partido}
                  {diputado.estado && <Text> - {diputado.estado}</Text>}
                </Text>
              </View>
              <View style={styles.estadistica}>
                <View flexDirection={"row"} alignItems={"center"}>
                  <MaterialIcons
                    name="event-available"
                    size={17}
                    color={COLORS.black}
                  />
                  <Text style={styles.informacion}>
                    {diputado.asistencia}% asistencia
                  </Text>
                </View>
                <Tooltip text={TOOLTIPS.votaciones.definicion}>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <MsIcon
                      icon={msPersonRaisedHand}
                      size={18}
                      color={COLORS.black}
                    />
                    <Text style={styles.informacion}>
                      {Math.round(porcentajeVotaciones)}% votaciones
                    </Text>
                  </View>
                </Tooltip>
                <View flexDirection={"row"} alignItems={"center"}>
                  <MaterialIcons
                    name="assignment-late"
                    size={18}
                    color={COLORS.black}
                  />
                  <Text style={styles.informacion} marginLeft={"1%"}>
                    {diputado.oficios} oficios presentados
                  </Text>
                </View>
                <View flexDirection={"row"} alignItems={"center"}>
                  <MaterialIcons
                    name="addchart"
                    size={17}
                    color={COLORS.black}
                  />
                  <Text style={styles.informacion}>
                    {diputado.mociones} mociones presentadas
                  </Text>
                </View>
                <View flexDirection={"row"} alignItems={"center"}>
                  <MsIcon icon={msAlarm} size={18} color={COLORS.black} />
                  <Text style={styles.informacion}>
                    {atrasosDiputado}% atrasos
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
                <Text style={styles.data2}>
                  {representacionDistrital.representacion}%
                </Text>
              </View>
            </View>
            <Text
              style={styles.descripcion}
            >{`${diputado.profesion} de ${diputado.edad} años. ${diputado.trayectoria ? diputado.trayectoria : ""}`}</Text>
            <View style={styles.infoComisiones}>
              <MaterialIcons
                name="diversity-2"
                size={17}
                color={COLORS.black}
              />
              <Text style={styles.informacion}>Comisiones que integra:</Text>
            </View>
            {diputado.comisiones?.map((comision) => (
              <Text style={styles.comisiones} key={comision.id}>
                {comision.nombre}
              </Text>
            ))}

            <View style={styles.container3}></View>
            <Text style={styles.title2}>Estadísticas de la gestión.</Text>

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
                <View
                  width={"45%"}
                  marginVertical={"1%"}
                  alignSelf={"center"}
                  alignItems={"center"}
                >
                  <View marginVertical={"1%"} top={-6}>
                    <MsIcon icon={msBlock} size={18} color={COLORS.greenM} />
                  </View>
                  <Text style={styles.label} width={170} top={-3}>
                    No se encontró programa, propuestas o compromisos de
                    campaña.
                  </Text>
                </View>
              )}

              <View>
                <Text style={styles.label} marginVertical={5}>
                  Evolución de la opinión pública.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setModalEvolucionVisible(true)}
                >
                  <LineChart
                    areaChart
                    height={40}
                    xAxisLength={175}
                    data={dataLikes}
                    data2={dataRepresentacion}
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
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.container6}>
              <View>
                <TouchableOpacity
                  style={styles.container5}
                  onPress={cargarDetalleMociones}
                >
                  <View style={styles.circulo}>
                    <Text style={styles.data2}>{mocionesAprobadas}</Text>
                  </View>

                  <View style={{ width: 130, marginVertical: "3%" }}>
                    <Text style={styles.label2}>
                      Proyectos aprobados/presentados
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.container5}>
                  <View style={styles.circulo}>
                    <Text style={styles.data2}>{adherenciaPartido}%</Text>
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
                    <Text style={styles.data2}>
                      {compatibilidadUsuario.compatibilidad}%
                    </Text>
                  </View>
                  <View width={140} marginVertical={"3%"} marginLeft={5}>
                    <Text style={styles.label2}>
                      Compatibilidad con el representante
                    </Text>
                  </View>
                </View>
                <View style={styles.container5}>
                  <View style={styles.circulo}>
                    <Text style={styles.data2}>
                      {diputado.rankingEstadistico ?? "-"}
                    </Text>
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
              data={votacionesFiltradas}
              onSelect={() => console.log("click")}
              representante={diputado.id}
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
              <Text style={styles.tituloText}>Proyectos Presentados</Text>
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
                  size={24}
                  color={COLORS.greenM}
                />
              </View>

              <View style={styles.modalEvolucionTitulos}>
                <Text style={styles.modalEvolucionTitulo}>
                  Evolución de la opinión pública
                </Text>

                <Text style={styles.modalEvolucionSubtitulo}>
                  Historial semanal del representante
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalEvolucionCerrar}
                onPress={() => setModalEvolucionVisible(false)}
                hitSlop={10}
              >
                <Ionicons name="close" size={18} color={COLORS.greenM} />
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
                    Representación distrital
                  </Text>

                  <Text style={styles.leyendaDescripcion}>
                    Coincidencia con las preferencias de usuarios del distrito.
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
                  <Text style={styles.leyendaTitulo}>
                    Likes al representante
                  </Text>

                  <Text style={styles.leyendaDescripcion}>
                    Cantidad de usuarios que marcaron al diputado como favorito.
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
                  height={220}
                  width={Math.max(
                    Dimensions.get("window").width - 92,
                    dataRepresentacion.length * 58,
                  )}
                  // Representación distrital: verde claro
                  data={dataRepresentacion}
                  // Likes: verde oscuro
                  data2={dataLikes}
                  color={COLORS.verdeclaro}
                  color2={COLORS.greenM}
                  dataPointsColor1={COLORS.verdeclaro}
                  dataPointsColor2={COLORS.greenM}
                  dataPointsRadius={4}
                  thickness={3}
                  thickness2={3}
                  // Degradado de representación
                  startFillColor={COLORS.verdeclaro}
                  startOpacity={0.55}
                  endFillColor={COLORS.back}
                  endOpacity={0.04}
                  // Degradado de likes
                  startFillColor2={COLORS.greenM}
                  startOpacity2={0.28}
                  endFillColor2={COLORS.back}
                  endOpacity2={0.03}
                  hideRules={false}
                  rulesColor="#E8ECE9"
                  rulesType="dashed"
                  yAxisColor={COLORS.grey}
                  yAxisThickness={0}
                  xAxisThickness={1}
                  xAxisColor={COLORS.grey}
                  initialSpacing={18}
                  spacing={58}
                  maxValue={100}
                  noOfSections={4}
                  yAxisTextStyle={styles.modalGraficoEjeY}
                  xAxisLabelTextStyle={styles.modalGraficoEjeX}
                  showVerticalLines
                  verticalLinesColor="#F0F2F0"
                  isAnimated
                  curved
                  animationDuration={700}
                />
              </ScrollView>
            </View>

            <View style={styles.modalEvolucionFooter}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={COLORS.greyM}
              />

              <Text style={styles.modalEvolucionNota}>
                Los valores corresponden a los snapshots semanales almacenados.
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
    fontSize: 21,
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
    marginRight: "5%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: "3%",
  },
  interes: {
    fontSize: 12,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greyM,
    paddingRight: 8,
  },
  title2: {
    fontSize: 16,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.black,
    marginLeft: "3%",
  },
  container3: {
    marginLeft: "5%",
    marginTop: "1%",
  },
  container4: {
    flexDirection: "row",
    marginHorizontal: "2%",
  },
  container5: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 5,
  },
  container6: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoComisiones: {
    marginHorizontal: "3.5%",
    flexDirection: "row",
    paddingTop: 10,
    paddingVertical: 5,
    alignItems: "center",
  },
  descripcion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 13,
    textAlign: "justify",
    marginHorizontal: "2.5%",
    lineHeight: 18,
    top: "1%",
  },
  comisiones: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 13,
    marginHorizontal: "2.5%",
    marginLeft: "6%",
    lineHeight: 20,
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
    marginLeft: "-5%",
  },
  info: {},
  informacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 13.5,
    color: COLORS.black,
    maxWidth: "98%",
    marginLeft: "2%",
    lineHeight: 25,
  },
  datausage: {
    marginTop: "8%",
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
    fontSize: 15,
    alignSelf: "center",
    marginTop: "2%",
  },
  keyboardView: {
    flex: 1,
    backgroundColor: COLORS.back,
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
    letterSpacing: 2,
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
  modalMocionesContainer: {
    width: "88%",
    maxHeight: "88%",
    backgroundColor: COLORS.back,
    borderRadius: 10,
    overflow: "hidden",
  },

  loadingMociones: {
    paddingVertical: 40,
    alignItems: "center",
  },

  listaMociones: {
    padding: 14,
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
    color: COLORS.black,
    lineHeight: 18,
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
    color: COLORS.black,
    lineHeight: 17,
    marginTop: 4,
  },

  votacionArticulo: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12.5,
    color: COLORS.black,
    lineHeight: 17,
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
  graficoEvolucionPreview: {
    position: "relative",
    marginVertical: 5,
  },

  graficoExpandir: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 25,
    height: 25,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.verdeclaro,
  },

  graficoEjeTextoPequeno: {
    color: COLORS.black,
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 8,
  },

  modalEvolucionContainer: {
    width: "91%",
    maxHeight: "86%",
    backgroundColor: COLORS.back,
    borderRadius: 22,
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

  modalEvolucionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: COLORS.back,
  },

  modalEvolucionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.verdeclaro,
  },

  modalEvolucionTitulos: {
    flex: 1,
    marginLeft: 12,
  },

  modalEvolucionTitulo: {
    color: COLORS.greenM,
    fontSize: 17,
    lineHeight: 23,
    fontFamily: "NotoSansMyanmar_700Bold",
  },

  modalEvolucionSubtitulo: {
    color: COLORS.greyM,
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: "NotoSansMyanmar_400Regular",
  },

  modalEvolucionCerrar: {
    position: "absolute",
    top: 12,
    right: 12,

    width: 24,
    height: 24,
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLORS.verdeclaro,
    zIndex: 10,
  },

  modalEvolucionLeyenda: {
    marginHorizontal: 16,
    padding: 13,
    borderRadius: 14,
    backgroundColor: "#F7FAF8",
    borderWidth: 1,
    borderColor: "#E7ECE8",
  },

  leyendaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 5,
  },

  leyendaLinea: {
    width: 24,
    height: 4,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },

  leyendaTextos: {
    flex: 1,
  },

  leyendaTitulo: {
    color: COLORS.black,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "NotoSansMyanmar_700Bold",
  },

  leyendaDescripcion: {
    color: COLORS.greyM,
    fontSize: 11.5,
    lineHeight: 16,
    fontFamily: "NotoSansMyanmar_400Regular",
  },

  modalGraficoContainer: {
    marginHorizontal: 16,
    marginTop: 15,
    paddingTop: 14,
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: "#E7ECE8",
    borderRadius: 16,
    backgroundColor: COLORS.back,
    overflow: "hidden",
  },

  modalGraficoScroll: {
    paddingHorizontal: 10,
    paddingRight: 25,
  },

  modalGraficoEjeY: {
    color: COLORS.greyM,
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontSize: 10,
  },

  modalGraficoEjeX: {
    color: COLORS.greyM,
    fontFamily: "NotoSansMyanmar_600SemiBold",
    fontSize: 9,
    marginTop: 4,
  },

  modalEvolucionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  modalEvolucionNota: {
    marginLeft: 6,
    color: COLORS.greyM,
    fontSize: 10.5,
    fontFamily: "NotoSansMyanmar_400Regular",
  },
});
