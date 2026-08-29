import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import { BuscadorContext } from "../context/BuscadorContext";
import {
  msPersonRaisedHand,
  msBlock,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import { useAuth } from "../context/AuthContext";
import { compromisosRepository } from "../infrastructure/compromisosRepository";
import Ionicons from "@react-native-vector-icons/ionicons";
import { legisladoresRepository } from "../infrastructure/legisladoresRepository";
import { Skeleton } from "../components/Skeleton";
import { votacionesRepository } from "../infrastructure/votacionesRepository";
import Tooltip, { TOOLTIPS } from "../components/tooltip";
import { ActivityIndicator } from "react-native";
import { responsiveWidthScale } from "../utils/responsive";
import { useReacciones } from "../context/ReaccionesContext";
import { useData } from "../context/DataContext";
import { FONTS } from "../constants/fonts";
import { FontAwesome } from "@expo/vector-icons";

const SEMANAS_VISIBLES_GRAFICO = 8;

const anchoGrafico = responsiveWidthScale(312);

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

const ModalHeader = ({
  icon,
  title,
  subtitle,
  onClose,
}) => {
  return (
    <View style={styles.modalHeader}>
      <View style={styles.modalHeaderIcon}>
        <MaterialIcons
          name={icon}
          size={responsiveWidthScale(24)}
          color={COLORS.greenM}
        />
      </View>

      <View style={styles.modalHeaderTitulos}>
        <Text style={styles.modalHeaderTitulo}>
          {title}
        </Text>

        <Text style={styles.modalHeaderSubtitulo}>
          {subtitle}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.modalHeaderCerrar}
        onPress={onClose}
        hitSlop={10}
        activeOpacity={0.7}
      >
        <Ionicons
          name="close"
          size={responsiveWidthScale(18)}
          color={COLORS.greenM}
        />
      </TouchableOpacity>
    </View>
  );
};

export const DescripcionSenador = ({ route }) => {
  const { user, circunscripcion, puedeInteractuar } = useAuth();

  const { reaccionesRepresentante, setReaccionRepresentante } = useReacciones();
  const {
    obtenerSenador,
    actualizarSenador,
    obtenerDetalleSenador,
    cargarDetalleSenador,
    totalesLikesRepresentantes,
    actualizarTotalLikesRepresentante,
  } = useData();

  const idSenador = route.params?.idSenador;

  const senadorCache = obtenerSenador(idSenador);

  const [senador, setSenador] = useState(
    senadorCache ?? route.params?.senadorInicial,
  );

  const [porcentajeVotaciones, setPorcentajeVotaciones] = useState("");
  const [acuerdosSenador, setAcuerdosSenador] = useState("");

  const [loading, setLoading] = useState(true);

  const { search, setSearch } = useContext(BuscadorContext);
  const [modalVisible, setModalVisible] = useState(false);

  const [compromisos, setCompromisos] = useState([]);
  const [dataGrafico, setDataGrafico] = useState([{}]);

  const [ultimasVotaciones, setUltimasVotaciones] = useState([]);
  const [votacionesFiltradas, setVotacionesFiltradas] = useState([]);

  const [idSenadorCamara, setIdSenadorCamara] = useState(null);
  const [buscandoVotaciones, setBuscandoVotaciones] = useState(false);
  const [adherenciaPartido, setAdherenciaPartido] = useState("");
  const [mocionesAprobadas, setMocionesAprobadas] = useState("0/0");
  const [busquedaMociones, setBusquedaMociones] = useState("");

  const [detalleMociones, setDetalleMociones] = useState([]);
  const [modalMocionesVisible, setModalMocionesVisible] = useState(false);
  const [loadingMociones, setLoadingMociones] = useState(false);
  const [modalEvolucionVisible, setModalEvolucionVisible] = useState(false);
  const [metricasHistoricas, setMetricasHistoricas] = useState([]);

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

  const normalizarBusqueda = (texto = "") => {
    return String(texto)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  useEffect(() => {
    if (!senadorCache) return;

    setSenador((anterior) => ({
      ...anterior,
      ...senadorCache,
    }));
  }, [senadorCache]);

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

  const dataLikesCompleta = metricasHistoricas.map((item) => ({
    value: Number(item.totalLikes ?? 0),
    label: formatearFechaGrafico(item.fechaSnapshot),
    fechaSnapshot: item.fechaSnapshot,
  }));

  const dataRepresentacionCompleta = metricasHistoricas.map((item) => ({
    value: Number(item.representacionDistrital ?? 0),
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

  useEffect(() => {
    const texto = search.trim();

    console.log("BUSCADOR SENADOR:", {
      texto,
      idSenadorCamara,
      ultimasVotaciones: ultimasVotaciones?.length,
    });

    if (!idSenadorCamara) return;

    if (texto.length < 2) {
      setVotacionesFiltradas(ultimasVotaciones);
      setBuscandoVotaciones(false);
      return;
    }

    setBuscandoVotaciones(true);

    const timeout = setTimeout(async () => {
      try {
        const votaciones = await votacionesRepository.buscarVotacionesSenado(
          texto,
          20,
        );


        console.log("VOTACIONES SENADO ENCONTRADAS:", votaciones);

        const idsVotaciones = votaciones.map((v) => v.id);

        const votos = await votacionesRepository.getVotosSenadorPorVotaciones(
          idSenadorCamara,
          idsVotaciones,
        );

        console.log("VOTOS SENADOR ENCONTRADOS:", votos);

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
        console.error("Error buscando votaciones del senador:", error);
        setVotacionesFiltradas([]);
      } finally {
        setBuscandoVotaciones(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, idSenadorCamara, ultimasVotaciones]);

  const reaccionActual = reaccionesRepresentante[idSenador];

  const cargarDatosDetalle = async () => {
    const data = await legisladoresRepository.getSenadorById(idSenador);

    const idSenadorCamara = data?.senador?.id;

    const [
      // acuerdosSenador,
      porcentajeVotaciones,
      adherenciaPartido,
      mocionesAprobadasData,
      compatibilidadUsuario,
      representacionDistrital,
      ultimasVotaciones,
    ] = await Promise.all([
      // legisladoresRepository.getAcuerdosSenador(idSenadorCamara),

      legisladoresRepository.getParticipacionHistoricaSenador(
        idSenadorCamara,
      ),

      legisladoresRepository.getAdherenciaSenadorPartido(idSenadorCamara),

      legisladoresRepository.getMocionesAprobadasSenador(idSenadorCamara),

      legisladoresRepository.getCompatibilidadUsuarioSenador(
        user.id,
        idSenadorCamara,
      ),

      legisladoresRepository.getRepresentacionCircunscripcionSenador(
        idSenadorCamara,
      ),

      getUltimasVotacionesSenador(idSenadorCamara),
    ]);

    return {
      senadorCompleto: data,
      idSenadorCamara,
      comisiones: data?.comisiones ?? [],

      acuerdosSenador: data?.acuerdos ?? 0,

      porcentajeVotaciones,

      adherenciaPartido,
      mocionesAprobadas: mocionesAprobadasData?.fraccion ?? "0/0",
      compatibilidadUsuario,

      representacionDistrital,

      ultimasVotaciones,
    };
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

    const compromisosFormateados = Object.keys(compromisosAgrupados).map(
      (categoria) => ({
        titulo: categoria,
        data: compromisosAgrupados[categoria],
      }),
    );

    const dataGrafico = compromisos.map((item) => ({
      value: 20,
      color: item.cumplimiento ? COLORS.greenM : COLORS.verdeclaro,
    }));

    return {
      compromisos: compromisosFormateados,
      dataGrafico,
    };
  };

  const normalizarTexto = (texto = "") => {
    return texto.trim().replace(/\s+/g, " ").toLowerCase();
  };

  const cargarDetalleMociones = async () => {
    if (!idSenadorCamara) return;

    setBusquedaMociones("");

    try {
      setLoadingMociones(true);

      const data =
        await legisladoresRepository.getDetalleMocionesSenador(
          idSenadorCamara,
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
              materia: row.tema?.trim() ?? null,
              materiaResumen: null,
              articulo: null,
              articuloResumen: null,
              resultado: row.resultado,
              fechaTexto: row.fecha_texto,
              fechaDate: row.fecha_date,
              sesion: row.numero_sesion
                ? `Sesión N° ${row.numero_sesion}`
                : null,
            });
          }

          return acc;
        }, {}),
      );

      const esVotacionAprobada = (votacion) => {
        const resultado = normalizarTexto(votacion?.resultado || "");

        return resultado.startsWith("aprobad");
      };

      const mocionesProcesadas = agrupadas.map((mocion) => {
        let materiaAnterior = "";
        let articuloAnterior = "";

        const votacionesOrdenadas = [...mocion.votaciones].sort(
          (a, b) =>
            Number(esVotacionAprobada(b)) -
            Number(esVotacionAprobada(a)),
        );

        const votaciones = votacionesOrdenadas.map((votacion) => {
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

      const mocionesOrdenadas = [...mocionesProcesadas].sort((a, b) => {
        const aTieneAprobada = a.votaciones.some(esVotacionAprobada);
        const bTieneAprobada = b.votaciones.some(esVotacionAprobada);

        return Number(bTieneAprobada) - Number(aTieneAprobada);
      });

      setDetalleMociones(mocionesOrdenadas);
      setModalMocionesVisible(true);
    } catch (error) {
      console.error("Error cargando detalle de mociones:", error);
    } finally {
      setLoadingMociones(false);
    }
  };

  const detalleMocionesFiltradas = detalleMociones.filter((mocion) => {
    const busqueda = normalizarBusqueda(busquedaMociones);

    if (!busqueda) return true;

    const contenidoMocion = [
      mocion.numeroBoletin,
      mocion.titulo,

      ...mocion.votaciones.flatMap((votacion) => [
        votacion.materia,
        votacion.materiaResumen,
        votacion.materiaMostrar,
        votacion.articulo,
        votacion.articuloResumen,
        votacion.articuloMostrar,
      ]),
    ]
      .filter(Boolean)
      .join(" ");

    return normalizarBusqueda(contenidoMocion).includes(busqueda);
  });

  const getUltimasVotacionesSenador = async (idSenadorCamara) => {
    const votaciones =
      await votacionesRepository.getUltimasVotacionesSenador(
        20,
        idSenadorCamara,
      );

    return votaciones;
  };

  const getMetricasHistoricas = async () => {
    try {
      const data =
        await legisladoresRepository.getMetricasHistoricasSenador(idSenador);

      return data;
    } catch (error) {
      console.error("Error cargando métricas históricas del senador:", error);

      return [];
    }
  };

  const aplicarDetalleSenador = (detalle) => {
    if (!detalle) return;

    if (detalle.senadorCompleto) {
      setSenador((anterior) => ({
        ...anterior,
        ...detalle.senadorCompleto,
        comisiones: detalle.comisiones ?? [],
      }));

      if (senadorCache) {
        actualizarSenador(idSenador, () => ({
          ...detalle.senadorCompleto,
          comisiones: detalle.comisiones ?? [],
        }));
      }
    }

    setIdSenadorCamara(detalle.idSenadorCamara);
    setAcuerdosSenador(detalle.acuerdosSenador);
    setPorcentajeVotaciones(detalle.porcentajeVotaciones);

    // Pendientes de implementar en Senado:
    setAdherenciaPartido(detalle.adherenciaPartido);
    setMocionesAprobadas(detalle.mocionesAprobadas);
    setCompatibilidadUsuario(detalle.compatibilidadUsuario);

    setRepresentacionDistrital(detalle.representacionDistrital);

    // Pendiente de implementar en Senado:
    setUltimasVotaciones(detalle.ultimasVotaciones);
    setVotacionesFiltradas(detalle.ultimasVotaciones);

    setCompromisos(detalle.compromisos);
    setDataGrafico(detalle.dataGrafico);
    setMetricasHistoricas(detalle.metricasHistoricas);
  };

  const fetchAll = async () => {
    try {
      const detalleGuardado = obtenerDetalleSenador(idSenador);

      setLoading(!detalleGuardado);

      const detalle = await cargarDetalleSenador(idSenador, async () => {
        const [datosPrincipales, datosCompromisos, metricasHistoricas] =
          await Promise.all([
            cargarDatosDetalle(),
            getCompromisos(),
            getMetricasHistoricas(),
          ]);

        return {
          ...datosPrincipales,
          ...datosCompromisos,
          metricasHistoricas,
        };
      });

      aplicarDetalleSenador(detalle);
    } catch (error) {
      console.error("Error cargando detalle del senador:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const borderColor = coloresPorPartido[senador.partido] || "#000";

  const filtrarVotaciones = (texto) => {
    const filtradas = votacionesRepository.filtrarVotaciones(
      ultimasVotaciones,
      texto,
    );
    setVotacionesFiltradas(filtradas);
    return filtradas;
  };

  const spacingGrafico =
    dataRepresentacion.length > 1
      ? (anchoGrafico - responsiveWidthScale(36)) /
      (dataRepresentacion.length - 1)
      : responsiveWidthScale(50);

  const totalLikesVisible =
    totalesLikesRepresentantes[idSenador] ??
    senador?.totalLikes ??
    0;

  const renderGridItem = (item) => {
    return (
      <View style={styles.containerModal1}>
        <Text
          style={{
            color: COLORS.black,
            fontSize: Math.max(11, responsiveWidthScale(15)),
            fontFamily: FONTS.bold,
            marginLeft: responsiveWidthScale(20),
            lineHeight: responsiveWidthScale(30),
            marginTop: responsiveWidthScale(8),
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
                  size={responsiveWidthScale(15)}
                  color={COLORS.greenM}
                  style={{
                    alignSelf: "center",
                    marginTop: responsiveWidthScale(-2),
                  }}
                />
              ) : (
                <Ionicons
                  name="chevron-forward-circle"
                  size={responsiveWidthScale(15)}
                  color={COLORS.grey}
                  style={{
                    alignSelf: "center",
                    marginTop: responsiveWidthScale(-2),
                  }}
                />
              )}

              <Text
                style={{
                  color: COLORS.black,
                  fontSize: Math.max(11, responsiveWidthScale(13)),
                  fontFamily: FONTS.regular,
                  lineHeight: responsiveWidthScale(16),
                  textAlign: "justify",
                  marginLeft: responsiveWidthScale(8),
                  marginVertical: responsiveWidthScale(3),
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

  const puedeDarLikeDistrito =
    puedeInteractuar &&
    Number(circunscripcion) === Number(senador?.circunscripcion);

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
                {senador.nombre}
              </Text>
              <TouchableOpacity
                style={styles.favorite}
                hitSlop={8}
                activeOpacity={puedeDarLikeDistrito ? 0.2 : 1}
                onPress={async () => {
                  if (!puedeDarLikeDistrito) return;

                  const resultado = await setReaccionRepresentante(
                    idSenador,
                    "like",
                  );

                  if (!resultado) return;

                  const { anterior, nueva } = resultado;

                  let cambio = 0;

                  if (anterior !== "like" && nueva === "like") cambio = 1;
                  if (anterior === "like" && nueva !== "like") cambio = -1;

                  const totalActual =
                    totalesLikesRepresentantes[idSenador] ??
                    senador?.totalLikes ??
                    0;

                  const nuevoTotal = Math.max(Number(totalActual) + cambio, 0);

                  actualizarTotalLikesRepresentante(idSenador, nuevoTotal);

                  setSenador((prev) => ({
                    ...prev,
                    totalLikes: nuevoTotal,
                  }));
                }}
              >
                <Text style={styles.interes}>
                  {totalLikesVisible > 0 ? totalLikesVisible : ""}
                </Text>

                <Ionicons
                  name="heart-circle-outline"
                  size={responsiveWidthScale(34)}
                  color={
                    reaccionActual === "like" ? COLORS.greenM : COLORS.grey
                  }
                />

                {!puedeDarLikeDistrito && (
                  <View style={styles.favoriteTooltipOverlay}>
                    <Tooltip text={TOOLTIPS.reaccionFueraDistrito}>
                      <View style={styles.favoriteTooltipTouchArea} />
                    </Tooltip>
                  </View>
                )}
              </TouchableOpacity>
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
                  source={{ uri: senador.foto }}
                />
                <Text style={styles.partido}>
                  {senador.partido}
                  {senador.estado && <Text> - {senador.estado}</Text>}
                </Text>
              </View>
              <View style={styles.estadistica}>
                <Tooltip text={TOOLTIPS.asistencia.acumulada}>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <MaterialIcons
                      name="event-available"
                      size={responsiveWidthScale(17)}
                      color={COLORS.black}
                    />
                    <Text style={styles.informacion}>
                      {senador.asistencia}% asistencia
                    </Text>
                  </View>
                </Tooltip>
                <Tooltip text={TOOLTIPS.votaciones.especifica}>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <MsIcon
                      icon={msPersonRaisedHand}
                      size={responsiveWidthScale(18)}
                      color={COLORS.black}
                    />
                    <Text style={styles.informacion}>
                      {Math.round(porcentajeVotaciones)}% votaciones
                    </Text>
                  </View>
                </Tooltip>
                <Tooltip text={TOOLTIPS.oficios}>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <MaterialIcons
                      name="assignment-late"
                      size={responsiveWidthScale(18)}
                      color={COLORS.black}
                    />
                    <Text style={styles.informacion} marginLeft={"1%"}>
                      {senador.oficios} oficios presentados
                    </Text>
                  </View>
                </Tooltip>
                <Tooltip text={TOOLTIPS.mociones.especifica}>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <MaterialIcons
                      name="addchart"
                      size={responsiveWidthScale(17)}
                      color={COLORS.black}
                    />
                    <Text style={styles.informacion}>
                      {senador.mociones} mociones presentadas
                    </Text>
                  </View>
                </Tooltip>
                <Tooltip text={TOOLTIPS.atrasos}>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <FontAwesome
                      name="handshake-o"
                      size={responsiveWidthScale(14)}
                      color={COLORS.black}
                    />
                    <Text style={styles.informacion}>
                      {acuerdosSenador} acuerdos
                    </Text>
                  </View>
                </Tooltip>
              </View>
              <View style={styles.datausage}>
                <MaterialIcons
                  name="data-usage"
                  size={responsiveWidthScale(50)}
                  color={COLORS.verdeclaro}
                  position="absolute"
                />

                <Text style={styles.data2}>
                  {representacionDistrital.representacion}%
                </Text>

                <View style={styles.datausageTooltip}>
                  <Tooltip text={TOOLTIPS.representaciondistrital.legislador}>
                    <View style={styles.datausageTouchArea} />
                  </Tooltip>
                </View>
              </View>
            </View>

            {senador.periodoInicio && senador.periodoFin && (
              <Text style={styles.periodo}>
                Período: {senador.periodoInicio} - {senador.periodoFin}
              </Text>
            )}

            <Text style={styles.descripcion}>
              {`${senador.profesion} de ${senador.edad} años. ${senador.trayectoria ? senador.trayectoria : ""
                }`}
            </Text>
            <View style={styles.infoComisiones}>
              <MaterialIcons
                name="diversity-2"
                size={responsiveWidthScale(17)}
                color={COLORS.black}
              />
              <Text style={styles.informacion}>Comisiones que integra:</Text>
            </View>
            {senador.comisiones?.map((comision) => (
              <Text style={styles.comisiones} key={comision.id}>
                {comision.nombre}
              </Text>
            ))}

            <View style={styles.container3}></View>
            <Text style={styles.title2}>Estadísticas de la gestión.</Text>

            <View style={styles.container4}>
              {dataGrafico.length > 0 ? (
                <View style={styles.containerAvances}>
                  <View
                    width={responsiveWidthScale(90)}
                    marginVertical={"5%"}
                    alignSelf={"center"}
                  >
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
                      strokeWidth={responsiveWidthScale(1)}
                      donut
                      data={dataGrafico}
                      showValuesAsLabels={true}
                      innerRadius={responsiveWidthScale(18)}
                      radius={responsiveWidthScale(45)}
                      textSize={responsiveWidthScale(18)}
                      centerLabelComponent={() => {
                        return (
                          <View>
                            <Text
                              style={{
                                color: COLORS.greenM,
                                fontSize: Math.max(
                                  11,
                                  responsiveWidthScale(14),
                                ),
                                fontFamily: FONTS.bold,
                              }}
                            >
                              0%
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  width={"45%"}
                  marginVertical={"1%"}
                  alignSelf={"center"}
                  alignItems={"center"}
                >
                  <View marginVertical={"1%"} top={responsiveWidthScale(-6)}>
                    <MsIcon
                      icon={msBlock}
                      size={responsiveWidthScale(18)}
                      color={COLORS.greenM}
                    />
                  </View>

                  <Text
                    style={styles.label}
                    width={responsiveWidthScale(170)}
                    top={responsiveWidthScale(-3)}
                  >
                    No se encontró programa, propuestas o compromisos de
                    campaña.
                  </Text>
                </View>
              )}

              <View marginLeft={"-5%"}>
                <Text style={styles.label} marginVertical={5} marginBottom={10}>
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
              <View>
                <TouchableOpacity
                  style={styles.container5}
                  onPress={cargarDetalleMociones}
                >
                  <View style={styles.circulo}>
                    <Text style={styles.data2}>{mocionesAprobadas}</Text>
                  </View>

                  <View
                    style={{
                      width: responsiveWidthScale(135),
                      marginVertical: "3%",
                      marginLeft: responsiveWidthScale(5),
                    }}
                  >
                    <Text style={styles.label2}>
                      Proyectos aprobados/presentados
                    </Text>
                  </View>
                </TouchableOpacity>
                <Tooltip text={TOOLTIPS.adherenciaPartido}>
                  <View style={styles.container5}>
                    <View style={styles.circulo}>
                      <Text style={styles.data2}>{adherenciaPartido}%</Text>
                    </View>

                    <View
                      style={{
                        width: responsiveWidthScale(135),
                        marginLeft: responsiveWidthScale(5),
                      }}
                    >
                      <Text style={styles.label2}>
                        Adherencia al partido político
                      </Text>
                    </View>
                  </View>
                </Tooltip>
              </View>
              <View>
                <Tooltip text={TOOLTIPS.compatibilidadUsuarioLegislador}>
                  <View style={styles.container5}>
                    <View style={styles.circulo}>
                      <Text style={styles.data2}>
                        {compatibilidadUsuario.compatibilidad}%
                      </Text>
                    </View>

                    <View
                      style={{
                        width: responsiveWidthScale(140),
                        marginVertical: "3%",
                        marginLeft: responsiveWidthScale(5),
                      }}
                    >
                      <Text style={styles.label2}>
                        Compatibilidad con el representante
                      </Text>
                    </View>
                  </View>
                </Tooltip>
                <Tooltip text={TOOLTIPS.lugarEstadisticoLegislador}>
                  <View style={styles.container5}>
                    <View style={styles.circulo}>
                      <Text style={styles.data2}>
                        {senador.rankingEstadistico ?? "-"}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: responsiveWidthScale(147),
                        marginVertical: "3%",
                        marginLeft: responsiveWidthScale(5),
                      }}
                    >
                      <Text style={styles.label2}>
                        Lugar estadístico entre los representantes
                      </Text>
                    </View>
                  </View>
                </Tooltip>
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
              representante={senador.id}
            />
          </View>
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContainer}>
            <ModalHeader
              icon="fact-check"
              title="Compromisos*"
              subtitle="Propuestas y prioridades del representante"
              onClose={() => setModalVisible(false)}
            />
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
            <ModalHeader
              icon="addchart"
              title="Proyectos presentados"
              subtitle="Iniciativas ingresadas por el representante"
              onClose={() => setModalMocionesVisible(false)}
            />
            <View style={styles.buscadorMociones}>
              <Buscador
                value={busquedaMociones}
                onChangeText={setBusquedaMociones}
                placeholder="Buscar boletín, proyecto o tema..."
              />
            </View>
            {loadingMociones ? (
              <View style={styles.loadingMociones}>
                <ActivityIndicator size="large" color={COLORS.greenM} />
              </View>
            ) : (
              <FlatList
                data={detalleMocionesFiltradas}
                keyExtractor={(item) => item.numeroBoletin}
                contentContainerStyle={styles.listaMociones}
                ListEmptyComponent={
                  <Text style={styles.sinResultadosMociones}>
                    No se encontraron proyectos relacionados.
                  </Text>
                }
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
                  Historial semanal del representante
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
                    Cantidad de usuarios que marcaron al senador como favorito.
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
    borderRadius: 10,

    // Android
    elevation: 3,

    // iOS
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  container1: {
    marginLeft: "8%",
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
    fontSize: Math.max(11, responsiveWidthScale(21)),
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginTop: '0.8%'
  },
  comentarioModal: {
    fontSize: Math.max(11, responsiveWidthScale(14)),
    fontFamily: FONTS.regular,
    color: COLORS.greenM,
    lineHeight: responsiveWidthScale(18),
    textAlign: "right",
  },
  favorite: {
    marginRight: "5%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: "3%",
  },
  favoriteTooltipOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },

  favoriteTooltipTouchArea: {
    width: "100%",
    height: "100%",
  },
  interes: {
    fontSize: Math.max(11, responsiveWidthScale(12)),
    fontFamily: FONTS.bold,
    color: COLORS.greyM,
    paddingRight: responsiveWidthScale(8),
  },
  title2: {
    fontSize: Math.max(11, responsiveWidthScale(16)),
    fontFamily: FONTS.bold,
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
    justifyContent: "space-around",
    width: "96%",
  },
  containerAvances: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "-4%",
  },
  container5: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: responsiveWidthScale(4),
  },
  container6: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  infoComisiones: {
    marginHorizontal: "3.5%",
    flexDirection: "row",
    paddingTop: responsiveWidthScale(10),
    paddingVertical: responsiveWidthScale(5),
    alignItems: "center",
  },
  descripcion: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    textAlign: "justify",
    marginHorizontal: "2.5%",
    lineHeight: responsiveWidthScale(18),
    top: "1%",
  },
  comisiones: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    marginHorizontal: "2.5%",
    marginLeft: "6%",
    lineHeight: responsiveWidthScale(20),
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(12.5)),
    textAlign: "center",
    lineHeight: responsiveWidthScale(16),
  },
  label2: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(12.5)),
    textAlign: "auto",
    lineHeight: responsiveWidthScale(16),
  },
  containerInfo: {
    flexDirection: "row",
  },
  estadistica: {
    marginLeft: "-5%",
    marginTop: '-1%'
  },
  info: {},
  informacion: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(13.5)),
    color: COLORS.black,
    maxWidth: "98%",
    marginLeft: "2%",
    lineHeight: responsiveWidthScale(25),
  },
  datausage: {
    position: "relative",
    marginTop: "8%",
    marginRight: "1%",
    alignItems: "center",
    width: responsiveWidthScale(52),
    height: responsiveWidthScale(52),
    justifyContent: "center",
  },
  datausageTooltip: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10,
  },
  datausageTouchArea: {
    width: responsiveWidthScale(52),
    height: responsiveWidthScale(52),
  },
  circulo: {
    marginVertical: "4%",
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
    top: responsiveWidthScale(-1.5),
  },
  container2: {
    maxWidth: "98%",
    marginHorizontal: "2%",
    flexDirection: "row",
    marginLeft: "3.5%",
    marginVertical: "0.5%",
    justifyContent: "space-between",
  },
  partido: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(15)),
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
    borderRadius: responsiveWidthScale(10),
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    overflow: "hidden",
  },
  modalBody: {
    flexShrink: 1,
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalScrollContent: {
    paddingTop: responsiveWidthScale(2),
    paddingBottom: responsiveWidthScale(20),
  },
  modalFooter: {
    paddingVertical: responsiveWidthScale(10),
    marginHorizontal: "4%",
  },

  conteiner2: {
    paddingTop: responsiveWidthScale(10),
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
    borderRadius: responsiveWidthScale(10),
    overflow: "hidden",
  },
  loadingMociones: {
    paddingVertical: responsiveWidthScale(40),
    alignItems: "center",
  },
  listaMociones: {
    padding: responsiveWidthScale(14),
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
    color: COLORS.black,
    lineHeight: responsiveWidthScale(18),
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
    color: COLORS.black,
    lineHeight: responsiveWidthScale(17),
    marginTop: responsiveWidthScale(4),
  },
  votacionArticulo: {
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(12.5)),
    color: COLORS.black,
    lineHeight: responsiveWidthScale(17),
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
    fontFamily: FONTS.bold,
    fontSize: 8,
  },
  modalEvolucionContainer: {
    width: "91%",
    maxHeight: "86%",
    backgroundColor: COLORS.back,
    borderRadius: responsiveWidthScale(22),
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
    paddingHorizontal: responsiveWidthScale(18),
    paddingTop: responsiveWidthScale(18),
    paddingBottom: responsiveWidthScale(14),
    backgroundColor: COLORS.back,
  },
  modalEvolucionIcon: {
    width: responsiveWidthScale(46),
    height: responsiveWidthScale(46),
    borderRadius: responsiveWidthScale(23),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.verdeclaro,
  },
  modalEvolucionTitulos: {
    flex: 1,
    marginLeft: responsiveWidthScale(12),
  },
  modalEvolucionTitulo: {
    color: COLORS.greenM,
    fontSize: Math.max(11, responsiveWidthScale(17)),
    lineHeight: responsiveWidthScale(23),
    fontFamily: FONTS.bold,
  },
  modalEvolucionSubtitulo: {
    color: COLORS.greyM,
    fontSize: Math.max(11, responsiveWidthScale(12.5)),
    lineHeight: responsiveWidthScale(18),
    fontFamily: FONTS.regular,
  },
  modalEvolucionCerrar: {
    position: "absolute",
    top: responsiveWidthScale(12),
    right: responsiveWidthScale(12),
    width: responsiveWidthScale(24),
    height: responsiveWidthScale(24),
    borderRadius: responsiveWidthScale(14),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.verdeclaro,
    zIndex: 10,
  },
  modalEvolucionLeyenda: {
    marginHorizontal: responsiveWidthScale(16),
    padding: responsiveWidthScale(13),
    borderRadius: responsiveWidthScale(14),
    backgroundColor: "#F7FAF8",
    borderWidth: responsiveWidthScale(1),
    borderColor: "#E7ECE8",
  },
  leyendaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: responsiveWidthScale(5),
  },
  leyendaLinea: {
    width: responsiveWidthScale(24),
    height: responsiveWidthScale(4),
    borderRadius: responsiveWidthScale(3),
    marginTop: responsiveWidthScale(7),
    marginRight: responsiveWidthScale(10),
  },
  leyendaTextos: {
    flex: 1,
  },
  leyendaTitulo: {
    color: COLORS.black,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    lineHeight: responsiveWidthScale(18),
    fontFamily: FONTS.bold,
  },
  leyendaDescripcion: {
    color: COLORS.greyM,
    fontSize: Math.max(11, responsiveWidthScale(11.5)),
    lineHeight: responsiveWidthScale(16),
    fontFamily: FONTS.regular,
  },
  modalGraficoContainer: {
    marginHorizontal: responsiveWidthScale(16),
    marginTop: responsiveWidthScale(15),
    paddingTop: responsiveWidthScale(14),
    paddingBottom: responsiveWidthScale(5),
    borderWidth: responsiveWidthScale(1),
    borderColor: "#E7ECE8",
    borderRadius: responsiveWidthScale(16),
    backgroundColor: COLORS.back,
    overflow: "hidden",
  },
  modalGraficoScroll: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  modalGraficoEjeY: {
    color: COLORS.greyM,
    fontFamily: FONTS.medium,
    fontSize: responsiveWidthScale(10),
  },
  modalGraficoEjeX: {
    color: COLORS.greyM,
    fontFamily: FONTS.medium,
    fontSize: responsiveWidthScale(9),
    marginTop: responsiveWidthScale(4),
  },
  modalEvolucionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: responsiveWidthScale(18),
    paddingVertical: responsiveWidthScale(14),
  },
  modalEvolucionNota: {
    marginLeft: responsiveWidthScale(6),
    color: COLORS.greyM,
    fontSize: Math.max(11, responsiveWidthScale(10.5)),
    fontFamily: FONTS.regular,
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsiveWidthScale(18),
    paddingTop: responsiveWidthScale(18),
    paddingBottom: responsiveWidthScale(14),
    backgroundColor: COLORS.back,
  },

  modalHeaderIcon: {
    width: responsiveWidthScale(46),
    height: responsiveWidthScale(46),
    borderRadius: responsiveWidthScale(23),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.verdeclaro,
  },

  modalHeaderTitulos: {
    flex: 1,
    marginLeft: responsiveWidthScale(12),
    paddingRight: responsiveWidthScale(18),
  },

  modalHeaderTitulo: {
    color: COLORS.greenM,
    fontSize: Math.max(11, responsiveWidthScale(17)),
    lineHeight: responsiveWidthScale(23),
    fontFamily: FONTS.bold,
  },

  modalHeaderSubtitulo: {
    color: COLORS.greyM,
    fontSize: Math.max(11, responsiveWidthScale(12.5)),
    lineHeight: responsiveWidthScale(18),
    fontFamily: FONTS.regular,
  },

  modalHeaderCerrar: {
    position: "absolute",
    top: responsiveWidthScale(12),
    right: responsiveWidthScale(12),
    width: responsiveWidthScale(18),
    height: responsiveWidthScale(18),
    borderRadius: responsiveWidthScale(9),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.verdeclaro,
    zIndex: 10,
  },
  buscadorMociones: {
    width: "100%",
    paddingHorizontal: responsiveWidthScale(14),
    paddingTop: responsiveWidthScale(10),
    paddingBottom: responsiveWidthScale(4),
    backgroundColor: COLORS.back,
  },

  sinResultadosMociones: {
    paddingVertical: responsiveWidthScale(28),
    paddingHorizontal: responsiveWidthScale(15),
    fontFamily: FONTS.regular,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    color: COLORS.greyM,
    textAlign: "center",
  },
  periodo: {
    fontFamily: FONTS.bold,
    fontSize: Math.max(11, responsiveWidthScale(13.5)),
    color: COLORS.greenM,
    marginHorizontal: "3%",
    marginTop: responsiveWidthScale(8),
    marginBottom: responsiveWidthScale(0.5),
  },
});
