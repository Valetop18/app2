import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Animated,
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
  msCalendarMonthFill,
} from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import Ionicons from "@react-native-vector-icons/ionicons";
import { FlatList } from "react-native-gesture-handler";
import RepresentantePartido from "../components/representantePartido";
import { useNavigation } from "@react-navigation/native";
import { legisladoresRepository } from "../infrastructure/legisladoresRepository";
import { Skeleton } from "../components/Skeleton";
import { partidosRepository } from "../infrastructure/partidosRepository";
import { votacionesRepository } from "../infrastructure/votacionesRepository";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useReacciones } from "../context/ReaccionesContext";
import {
  responsiveSize,
  responsiveSpacing,
  responsiveFont,
  responsiveIcon,
  responsiveFontCamara,
  responsiveHeight,
  responsiveVerticalSize,
} from "../utils/responsive";

export const CamaraDipu = () => {
  const { search, setSearch } = useContext(BuscadorContext);
  const [leyActual, setLeyActual] = useState({ fecha: "", nombre: "" });
  const [botonActivo, setBotonActivo] = useState(0);
  const [hoyActivo, setHoyActivo] = useState(true);
  const [habilitarTransicion, setHabilitarTransicion] = useState(true);
  const [pausado, setPausado] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [infoModal, setInfoModal] = useState({
    tipo: "",
    partido: "",
    partidoId: "",
    value: "",
    suffix: "",
    tiempo: "",
    representantesModo: "",
    icon: "",
  });

  const [legisladores, setLegisladores] = useState([]);
  const [asistenciaPartidosAcumulada, setAsistenciaPartidosAcumulada] =
    useState({});
  const [asistenciaPartidosSesion, setAsistenciaPartidosSesion] = useState({});
  const [asistenciaSesionGlobal, setAsistenciaSesionGlobal] = useState(null);
  const [votacionSesionGlobal, setVotacionSesionGlobal] = useState(null);
  const [asistenciaGlobal, setAsistenciaGlobal] = useState(null);
  const [participacionHistoricaGlobal, setParticipacionHistoricaGlobal] =
    useState(null);
  const [mocionesHistoricasGlobal, setMocionesHistoricasGlobal] =
    useState(null);

  const [datosListos, setDatosListos] = useState(false);

  const [votacionesPartidos, setVotacionesPartidos] = useState([]);
  const [votacionesPorSesion, setVotacionesPorSesion] = useState([]);
  const [votacionesPorSesion2, setVotacionesPorSesion2] = useState([]);
  const [votosRepresentantes, setVotosRepresentantes] = useState({});
  const [votosDiputadosSesion, setVotosDiputadosSesion] = useState({});

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarData, setCalendarData] = useState({
    sesiones: {},
    markedDates: {},
  });
  const [calendarLoading, setCalendarLoading] = useState(false);
  const shimmerAnim = React.useRef(new Animated.Value(-1)).current;
  const pulseAnim = React.useRef(new Animated.Value(0)).current;
  const [sesionesDia, setSesionesDia] = useState([]);

  const [votacionesPartidoPorSesion, setVotacionesPartidoPorSesion] = useState(
    [],
  );
  const [votacionBuscada, setVotacionBuscada] = useState(null);

  const [
    participacionHistoricaDiputadoPorPartido,
    setParticipacionHistoricaDiputadoPorPartido,
  ] = useState({});
  const [
    mocionesHistoricasDiputadoPorPartido,
    setMocionesHistoricasDiputadoPorPartido,
  ] = useState({});

  const [mocionesPorPartido, setMocionesPorPartido] = useState({});
  const { reaccionesLey, setReaccionLey } = useReacciones();
  const [proyectoActivo, setProyectoActivo] = useState(0);

  const MODO_DATA = {
    ESPECIFICA: "especifica",
    ACUMULADA: "acumulada",
    VOTACION_BUSCADA: "votacion_buscada",
  };

  const SECCION = {
    ASISTENCIA: "asistencia",
    VOTACION: "votacion",
    PROYECTOS: "proyectos",
  };

  const CONFIG_PORCENTAJES = {
    favor: { icon: "check-circle", iconColor: COLORS.greenM },
    contra: { icon: "cancel", iconColor: COLORS.FA },
    abstencion: { icon: "flaky", iconColor: COLORS.UDI },
    noVoto: { icon: "do-disturb-on", iconColor: COLORS.greyM },
    pareo: { icon: "join-right", iconColor: COLORS.PDG }, //definir icono y color
  };

  LocaleConfig.locales["es"] = {
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
      "Sep.",
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
    dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    today: "Hoy",
  };

  LocaleConfig.defaultLocale = "es";

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
    { id: 12, partido: "REP" },
    { id: 13, partido: "PS" },
    { id: 14, partido: "PSC" },
    { id: 15, partido: "RN" },
    { id: 16, partido: "UDI" },
    { id: 17, partido: "IND" },
    { id: 18, partido: "AH" },
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
        { id: 12, partido: "REP" },
        { id: 13, partido: "REP" },
        { id: 14, partido: "REP" },
        { id: 15, partido: "REP" },
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
        { id: 31, partido: "REP" },
        { id: 32, partido: "REP" },
        { id: 33, partido: "REP" },
        { id: 34, partido: "REP" },
        { id: 35, partido: "REP" },
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
        { id: 54, partido: "REP" },
        { id: 55, partido: "REP" },
        { id: 56, partido: "REP" },
        { id: 57, partido: "REP" },
        { id: 58, partido: "REP" },
        { id: 59, partido: "REP" },
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
        { id: 83, partido: "REP" },
        { id: 84, partido: "REP" },
        { id: 85, partido: "REP" },
        { id: 86, partido: "REP" },
        { id: 87, partido: "REP" },
        { id: 88, partido: "REP" },
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
        { id: 101, partido: "PDG" },
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
        { id: 115, partido: "REP" },
        { id: 116, partido: "REP" },
        { id: 117, partido: "REP" },
        { id: 118, partido: "REP" },
        { id: 119, partido: "REP" },
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
        { id: 138, partido: "AH" },
        { id: 139, partido: "UDI" },
        { id: 140, partido: "DEM" },
        { id: 141, partido: "UDI" },
        { id: 142, partido: "UDI" },
        { id: 143, partido: "UDI" },
        { id: 144, partido: "UDI" },
        { id: 145, partido: "EVOPOLI" },
        { id: 146, partido: "EVOPOLI" },
        { id: 147, partido: "PNL" },
        { id: 148, partido: "PNL" },
        { id: 149, partido: "PNL" },
        { id: 150, partido: "REP" },
        { id: 151, partido: "REP" },
        { id: 152, partido: "REP" },
        { id: 153, partido: "REP" },
        { id: 154, partido: "REP" },
        { id: 155, partido: "PSC" },
        { id: 156, partido: "PSC" },
      ],
    },
  ];

  const [leyesChilenas, setLeyesChilenas] = useState([]);
  const [buscandoLeyes, setBuscandoLeyes] = useState(false);
  const pelotas = [];
  const infoPartidos = [];
  const partidosCoordenadas = [];

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

  const getSeccionActiva = () => {
    if (botonActivo === 2) return SECCION.VOTACION;
    if (botonActivo === 3) return SECCION.PROYECTOS;
    return SECCION.ASISTENCIA;
  };

  const esVotacionBuscada = !!votacionBuscada;

  const getNumeroSesionActual = () =>
    votacionBuscada?.numeroSesion ?? asistenciaSesionGlobal?.numeroSesion;

  const getModoData = () => {
    if (esVotacionBuscada) return MODO_DATA.VOTACION_BUSCADA;

    return habilitarTransicion ? MODO_DATA.ESPECIFICA : MODO_DATA.ACUMULADA;
  };

  const obtenerVotoMayoritario = (porcentajes) => {
    if (!porcentajes) return { tipo: "noVoto", porcentaje: 0 };
    const { favor, contra, abstencion } = porcentajes;
    if (favor >= contra && favor >= abstencion)
      return { tipo: "favor", porcentaje: favor };
    if (contra > favor && contra > abstencion)
      return { tipo: "contra", porcentaje: contra };
    return { tipo: "abstencion", porcentaje: abstencion };
  };

  const getVotoConfig = (voto) => {
    if (!voto) return CONFIG_PORCENTAJES.noVoto;

    const normalized = voto.toString().toLowerCase();

    if (normalized.includes("favor")) return CONFIG_PORCENTAJES.favor;
    if (normalized.includes("contra")) return CONFIG_PORCENTAJES.contra;
    if (normalized.includes("abstenci")) return CONFIG_PORCENTAJES.abstencion;
    if (normalized.includes("pareo")) return CONFIG_PORCENTAJES.pareo;
    return CONFIG_PORCENTAJES.noVoto;
  };

  const getVotoRepresentante = (item) => {
    const votacionId = votacionesPorSesion[proyectoActivo]?.id;
    const diputados = votosRepresentantes[votacionId] || [];
    const representante = diputados.find((dipu) => dipu.id === item.id);
    return representante?.voto || null;
  };

  const buildInfoPartido = ({
    partido,
    value,
    suffix = "%",
    icon = null,
    iconColor = null,
    loading = false,
  }) => ({
    partido,
    value,
    suffix,
    icon,
    iconColor,
    loading,
    loadingComponent: (
      <View paddingVertical={6}>
        <ActivityIndicator size="small" color={COLORS.greenM} />
      </View>
    ),
  });

  const buildModalData = ({
    tipo,
    partido,
    partidoId,
    value,
    representantesModo,
    suffix = representantesModo === "proyectos-acumulada" ? null : "%",
    tiempo = botonActivo === 3 && (habilitarTransicion || votacionBuscada)
      ? `Sesión ${getNumeroSesionActual()}: ${votacionesPorSesion[0]?.fecha}`
      : "Acumulada período 2026-2030",
    icon,
  }) => ({
    tipo,
    partido,
    partidoId,
    value,
    suffix,
    tiempo,
    representantesModo,
    icon,
  });

  const getRepresentanteViewData = (item) => {
    if (infoModal.representantesModo === "asistencia-especifica") {
      return {
        ...item,
        icon: item.asistenciaSesion ? "check-circle" : "cancel",
        iconColor: item.asistenciaSesion ? COLORS.greenM : COLORS.FA,
        text: item.asistenciaSesion ? null : item.observacion,
      };
    }

    if (infoModal.representantesModo === "votacion-especifica") {
      const porcentaje = votosDiputadosSesion[item.id]?.porcentaje ?? 0;

      return {
        ...item,
        value: porcentaje,
        suffix: "%",
        icon: null,
        iconColor: null,
        text: null,
      };
    }

    if (infoModal.representantesModo === "votacion-acumulada") {
      const porcentaje = participacionHistoricaDiputadoPorPartido[item.id] ?? 0;

      return {
        ...item,
        value: porcentaje,
        suffix: "%",
        icon: null,
        iconColor: null,
        text: null,
      };
    }

    if (infoModal.representantesModo === "proyectos-acumulada") {
      const mociones = mocionesHistoricasDiputadoPorPartido[item.id] ?? 0;

      return {
        ...item,
        value: mociones,
        icon: null,
        iconColor: null,
        text: null,
        suffix: null,
      };
    }

    if (infoModal.representantesModo === "proyectos-especifica") {
      const voto = getVotoRepresentante(item);
      const config = getVotoConfig(voto);
      //console.log(item);

      return {
        ...item,
        icon: config.icon,
        iconColor: config.iconColor,
        suffix: null,
      };
    }

    return {
      ...item,
      value: item.asistencia ?? 0,
      suffix: "%",
      icon: null,
      iconColor: null,
      text: null,
    };
  };

  const getPartidoViewModel = ({ partido, partidoId }) => {
    // Modo especial cuando el usuario selecciona una votación desde el buscador.
    // En este modo no existe animación y solo se muestra una votación.
    const modoData = getModoData();

    switch (getSeccionActiva()) {
      case SECCION.ASISTENCIA: {
        const esEspecifica = modoData === MODO_DATA.ESPECIFICA;
        const porcentajeData = asistenciaPartidosAcumulada[partidoId] || {};

        const value = esEspecifica
          ? (asistenciaPartidosSesion[partidoId] ?? 0)
          : (porcentajeData.porcentajeAsistenciaHistorica ?? 0);

        const representantesModo = esEspecifica
          ? "asistencia-especifica"
          : "asistencia-acumulada";

        const infoPartido = buildInfoPartido({
          partido,
          value,
          loading: !datosListos,
        });

        return {
          seccion: SECCION.ASISTENCIA,
          modoData: esEspecifica ? MODO_DATA.ESPECIFICA : MODO_DATA.ACUMULADA,
          infoPartido,
          modalData: buildModalData({
            tipo: "Asistencia",
            partido,
            partidoId,
            value,
            representantesModo,
            icon: msCalendarMonthFill,
          }),
        };
      }

      case SECCION.VOTACION: {
        const esEspecifica = modoData === MODO_DATA.ESPECIFICA;

        const porcentajeVotacion = votacionesPartidos[partidoId] ?? 0;

        const value = esEspecifica
          ? (votacionesPartidoPorSesion[partidoId] ?? 0) //falta data especifica
          : (votacionesPartidos[partidoId] ?? 0);

        const representantesModo = esEspecifica
          ? "votacion-especifica"
          : "votacion-acumulada";

        const infoPartido = buildInfoPartido({
          partido,
          value,
        });

        return {
          seccion: SECCION.VOTACION,
          modoData: esEspecifica ? MODO_DATA.ESPECIFICA : MODO_DATA.ACUMULADA,
          infoPartido,
          modalData: buildModalData({
            tipo: "Votaciones",
            partido,
            partidoId,
            value,
            representantesModo,
            icon: msPersonRaisedHand,
          }),
        };
      }

      case SECCION.PROYECTOS: {
        const esEspecifica =
          modoData === MODO_DATA.ESPECIFICA ||
          modoData === MODO_DATA.VOTACION_BUSCADA;

        const porcentajes = esEspecifica
          ? votacionesPorSesion2[proyectoActivo]?.partidos[partidoId]
          : null;

        const votoMayoritario = obtenerVotoMayoritario(porcentajes);

        const config = esEspecifica
          ? CONFIG_PORCENTAJES[votoMayoritario.tipo]
          : null;

        const value = esEspecifica
          ? votoMayoritario.porcentaje
          : (mocionesPorPartido[partidoId] ?? 0);
        const suffix = esEspecifica ? "%" : "";

        const representantesModo = esEspecifica
          ? "proyectos-especifica"
          : "proyectos-acumulada";

        const infoPartido = buildInfoPartido({
          partido,
          value,
          suffix,
          icon: config?.icon,
          iconColor: config?.iconColor,
        });

        return {
          seccion: SECCION.PROYECTOS,
          modoData: esEspecifica ? MODO_DATA.ESPECIFICA : MODO_DATA.ACUMULADA,
          infoPartido,
          modalData: buildModalData({
            tipo: "Mociones",
            partido,
            partidoId,
            value,
            representantesModo,
            icon: msCloudUpload,
          }),
        };
      }

      default:
        return null;
    }
  };
  const obtenerLegisladoresPorPartido = async (
    partidoId,
    numeroSesion = null,
    modoData,
  ) => {
    try {
      const data = await legisladoresRepository.getDiputadosByPartido(
        partidoId,
        numeroSesion,
        modoData,
      );
      setLegisladores(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerVotosPartidoPorSesion = async (numeroSesion, partidoId) => {
    try {
      const data = await votacionesRepository.getVotosPartidoPorSesion(
        numeroSesion,
        partidoId,
      );

      const votosMap = data.reduce((acc, row) => {
        acc[row.id] = row.diputados;
        return acc;
      }, {});

      setVotosRepresentantes(votosMap);
      return data;
    } catch (error) {
      setVotosRepresentantes({});
      return [];
    }
  };

  const obtenerVotosPartidoPorVotacion = async (idVotacion, partidoId) => {
    try {
      const data = await votacionesRepository.getVotosPartidoPorVotacion(
        idVotacion,
        partidoId,
      );

      const votosMap = data.reduce((acc, row) => {
        acc[row.id] = row.diputados;
        return acc;
      }, {});

      setVotosRepresentantes(votosMap);
      return data;
    } catch (error) {
      setVotosRepresentantes({});
      return [];
    }
  };

  const obtenerVotacionDiputadosPorSesion = async (numeroSesion, partidoId) => {
    try {
      const data = await votacionesRepository.getVotacionDiputadosPorSesion(
        numeroSesion,
        partidoId,
      );

      const votosMap = data.reduce((acc, dipu) => {
        acc[dipu.id] = dipu;
        return acc;
      }, {});

      setVotosDiputadosSesion(votosMap);

      return data;
    } catch (error) {
      setVotosDiputadosSesion({});
      return [];
    }
  };

  const obtenerParticipacionHistoricaDiputadoPorPartido = async (partidoId) => {
    try {
      const data =
        await partidosRepository.getParticipacionHistoricaDiputadoPorPartido(
          partidoId,
        );
      console.log("ParticipacionHistoricaDiputadoPorPartido");
      console.log(data);
      setParticipacionHistoricaDiputadoPorPartido(data);
    } catch (error) {
      setParticipacionHistoricaDiputadoPorPartido({});
    }
  };

  const obtenerMocionesHistoricasDiputadoPorPartido = async (partidoId) => {
    try {
      const data =
        await partidosRepository.getMocionesHistoricasDiputadoPorPartido(
          partidoId,
        );
      console.log("MocionesHistoricasDiputadoPorPartido");
      console.log(data);
      setMocionesHistoricasDiputadoPorPartido(data);
    } catch (error) {
      setMocionesHistoricasDiputadoPorPartido({});
    }
  };

  const cargarAsistenciaSesionGlobal = async (numeroSesion = null) => {
    try {
      const data =
        await votacionesRepository.getAsistenciaSesionGlobal(numeroSesion);
      setAsistenciaSesionGlobal(data);
      return data?.numeroSesion;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cargarVotacionSesionGlobal = async (numeroSesion) => {
    try {
      const data =
        await votacionesRepository.getVotacionSesionGlobal(numeroSesion);
      setVotacionSesionGlobal(data);
      return data?.numeroSesion;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cargarAsistenciaGlobal = async () => {
    try {
      const data = await votacionesRepository.getAsistenciaGlobal();
      setAsistenciaGlobal(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cargarSesionesCalendar = async () => {
    try {
      setCalendarLoading(true);

      const data = await votacionesRepository.getFechaSesionCalendario();

      const markedDates = {};
      const sesiones = {};

      data.forEach((item) => {
        // Agrupar sesiones por fecha
        if (!sesiones[item.fecha_date]) {
          sesiones[item.fecha_date] = [];
        }

        sesiones[item.fecha_date].push(item);
      });

      Object.keys(sesiones).forEach((fecha) => {
        const cantidad = sesiones[fecha].length;

        markedDates[fecha] = {
          dots:
            cantidad === 2
              ? [{ color: "#2563EB" }, { color: "#EF4444" }]
              : [{ color: "#2563EB" }],
        };
      });

      setCalendarData({
        sesiones,
        markedDates,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setCalendarLoading(false);
    }
  };

  const abrirCalendario = async () => {
    if (Object.keys(calendarData.sesiones).length === 0) {
      await cargarSesionesCalendar();
    }

    setCalendarVisible(true);
  };

  const seleccionarSesion = async (sesion) => {
    setVotacionBuscada(null);

    setSesionesDia([]);
    setCalendarVisible(false);

    await cargarSesionSeleccionada(sesion.numero_sesion);
  };

  const seleccionarDia = (day) => {
    const sesiones = calendarData.sesiones[day.dateString];

    if (!sesiones) {
      setSesionesDia([]);
      return;
    }

    if (sesiones.length === 1) {
      seleccionarSesion(sesiones[0]);
      return;
    }

    setSesionesDia(sesiones);
  };

  const cargarVotacionHistoricaGlobal = async () => {
    try {
      const data = await votacionesRepository.getVotacionHistoricaGlobal();
      setParticipacionHistoricaGlobal(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cargarMocionesHistoricasGlobal = async () => {
    try {
      const data = await votacionesRepository.getMocionesHistoricasGlobal();
      setMocionesHistoricasGlobal(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cargarVotacionesPorSesion = async (numeroSesion) => {
  try {
    const data =
      await votacionesRepository.getVotacionesPorSesion(numeroSesion);

    const data2 =
      await votacionesRepository.getVotacionesPorSesion2(numeroSesion);

    const votacionesPartidosPorId = new Map(
      data2.map((votacion) => [
        String(votacion.id),
        votacion,
      ]),
    );

    const data2Ordenada = data.map((votacion) => {
      const votacionPartidos = votacionesPartidosPorId.get(
        String(votacion.id),
      );

      return (
        votacionPartidos || {
          id: votacion.id,
          tipoDocumento: votacion.tipoDocumento,
          fecha: votacion.fecha,
          resultado: votacion.resultado,
          materia_resumen: votacion.materia_resumen,
          articulo_resumen: votacion.articulo_resumen,
          partidos: {},
        }
      );
    });

    setVotacionesPorSesion(data);
    setVotacionesPorSesion2(data2Ordenada);
  } catch (error) {
    console.error(error);
    setVotacionesPorSesion([]);
    setVotacionesPorSesion2([]);
  } finally {
    setLoading(false);
  }
};

  const cargarVotacionBuscada = async (idVotacion) => {
    try {
      const data2 = await votacionesRepository.getVotacionPorId2(idVotacion);

      const votacion = data2?.[0];

      if (!votacion) {
        setVotacionesPorSesion([]);
        setVotacionesPorSesion2([]);
        return;
      }

      setVotacionesPorSesion([votacion]);
      setVotacionesPorSesion2([votacion]);

      setProyectoActivo(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cargarVotacionPartidoPorSesion = async (numeroSesion) => {
    if (!numeroSesion) return;

    try {
      const resultados = await Promise.all(
        partidos.map(async ({ id }) => {
          const porcentaje =
            await votacionesRepository.getVotacionPartidoPorSesion(
              numeroSesion,
              id,
            );
          return { id, porcentaje };
        }),
      );

      const map = resultados.reduce((acc, item) => {
        acc[item.id] = item.porcentaje;
        return acc;
      }, {});

      setVotacionesPartidoPorSesion(map);
    } catch (error) {
      console.error("Error al cargar votacion partido por sesion: ", error);
    }
  };

  const cargarMocionesPorPartido = async () => {
    try {
      const data = await partidosRepository.getMocionesPorPartido();
      setMocionesPorPartido(data);
    } catch (error) {
      setMocionesPorPartido({});
    }
  };

  const cargarAsistenciaSesion = async (numeroSesion = null) => {
    const resultados = await Promise.all(
      partidos.map(async ({ id }) => {
        const porcentaje = await partidosRepository.getAsistenciaPartidoSesion(
          id,
          numeroSesion,
        );
        return { id, porcentaje };
      }),
    );

    const map = resultados.reduce((acc, item) => {
      acc[item.id] = item.porcentaje;
      return acc;
    }, {});

    setAsistenciaPartidosSesion(map);
  };

  const cerrarCalendario = () => {
    setSesionesDia([]);
    setCalendarVisible(false);
  };

  const cargarPorcentajes = async () => {
    try {
      const resultados = await Promise.all(
        partidos.map(async ({ id }) => {
          try {
            const porcentajes =
              await legisladoresRepository.getPorcentajeAsistenciaPartido(id);

            return {
              id,
              ...porcentajes,
            };
          } catch (error) {
            return {
              id,
              porcentajeAsistenciaHoy: 0,
              porcentajeAsistenciaHistorica: 0,
            };
          }
        }),
      );

      const map = resultados.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      setAsistenciaPartidosAcumulada(map);

      return map;
    } catch (error) {
      console.error("Error al cargar porcentajes de asistencia:", error);

      setAsistenciaPartidosAcumulada({});

      return {};
    }
  };

  const cargarVotacionesPartidos = async () => {
    try {
      const votaciones = await Promise.all(
        partidos.map(async ({ id, partido }) => {
          const porcentajeVotaciones =
            await partidosRepository.getParticipacionHistoricaPartido(id);

          return {
            id,
            partido,
            porcentajeVotaciones,
          };
        }),
      );

      const map = votaciones.reduce((acc, item) => {
        acc[item.id] = Math.round(item.porcentajeVotaciones);
        return acc;
      }, {});

      setVotacionesPartidos(map);

      return map;
    } catch (error) {
      console.error(
        "Error al cargar votaciones históricas de partidos:",
        error,
      );

      setVotacionesPartidos({});

      return {};
    }
  };

  const cargarTodo = async () => {
    try {
      setLoading(true);
      setDatosListos(false);

      const numeroSesion = await cargarAsistenciaSesionGlobal();

      await Promise.all([
        cargarPorcentajes(),
        cargarVotacionesPartidos(),
        cargarAsistenciaSesion(),
        cargarVotacionesPorSesion(numeroSesion),
        cargarVotacionPartidoPorSesion(numeroSesion),
        cargarVotacionSesionGlobal(numeroSesion),
        cargarAsistenciaGlobal(),
        cargarVotacionHistoricaGlobal(),
        cargarMocionesHistoricasGlobal(),
        cargarMocionesPorPartido(),
      ]);

      setDatosListos(true);
    } catch (error) {
      console.error("Error al cargar los datos de la Cámara:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarSesionSeleccionada = async (numeroSesion) => {
    try {
      setDatosListos(false);
      setHabilitarTransicion(false);

      setProyectoActivo(0);
      setBotonActivo(1);
      setPausado(false);

      await Promise.all([
        cargarAsistenciaSesionGlobal(numeroSesion),
        cargarAsistenciaSesion(numeroSesion),
        cargarVotacionesPorSesion(numeroSesion),
        cargarVotacionPartidoPorSesion(numeroSesion),
        cargarVotacionSesionGlobal(numeroSesion),
      ]);

      setDatosListos(true);
      setHabilitarTransicion(true);
    } catch (error) {
      console.error("Error al cargar sesión seleccionada:", error);
      setDatosListos(true);
    }
  };

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.95],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.08],
  });

  for (const partido in promediosPartidos) {
    const [posicionX, posicionY] = promediosPartidos[partido];
    const id = `${partido}-${posicionX}-${posicionY}`;

    const partidoId = partidos.find((p) => p.partido === partido).id;

    const partidoViewModel = getPartidoViewModel({ partido, partidoId });

    if (!partidoViewModel) continue;

    const infoPartidoComponent = (
      <InfoPartido
        data={partidoViewModel.infoPartido}
        left={posicionX - 18}
        top={posicionY - 18}
        key={id}
        onPress={() => {
          setLoading(true);
          setLegisladores([]);

          if (partidoViewModel.seccion === SECCION.VOTACION) {
            obtenerVotacionDiputadosPorSesion(
              getNumeroSesionActual(),
              partidoId,
            );
          }

          if (
            partidoViewModel?.modalData?.representantesModo ===
            "votacion-acumulada"
          ) {
            obtenerParticipacionHistoricaDiputadoPorPartido(partidoId);
          }

          if (
            partidoViewModel?.modalData?.representantesModo ===
            "proyectos-acumulada"
          ) {
            obtenerMocionesHistoricasDiputadoPorPartido(partidoId);
          }

          if (partidoViewModel.seccion === SECCION.PROYECTOS) {
            if (votacionBuscada) {
              obtenerVotosPartidoPorVotacion(
                votacionBuscada.idVotacion,
                partidoId,
              );
            } else {
              obtenerVotosPartidoPorSesion(
                asistenciaSesionGlobal?.numeroSesion,
                partidoId,
              );
            }
          }

          obtenerLegisladoresPorPartido(
            partidoId,
            partidoViewModel.seccion === SECCION.ASISTENCIA
              ? getNumeroSesionActual()
              : null,
            partidoViewModel.modoData,
          );

          setModalVisible(true);
          setInfoModal(partidoViewModel.modalData);
        }}
      />
    );

    infoPartidos.push(infoPartidoComponent);
  }

  // Modo especial cuando el usuario selecciona una votación desde el buscador.
  // En este modo no existe animación y solo se muestra una votación.
  const handleResultPress = async (item) => {
    setSearch("");
    setVotacionBuscada(item);

    setDatosListos(false);

    setBotonActivo(3);
    setProyectoActivo(0);

    setHabilitarTransicion(false);
    setPausado(true);

    await cargarVotacionBuscada(item.idVotacion);

    setDatosListos(true);
  };

  useEffect(() => {
    if (!habilitarTransicion || pausado) return;

    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    );

    shimmerAnim.setValue(-1);
    animation.start();

    return () => animation.stop();
  }, [habilitarTransicion, pausado]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-160, 160],
  });

  useEffect(() => {
    if (!habilitarTransicion || pausado) {
      pulseAnim.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [habilitarTransicion, pausado]);

  useEffect(() => {
    const texto = search.trim();

    if (texto.length < 2) {
      setLeyesChilenas([]);
      setBuscandoLeyes(false);
      return;
    }

    setBuscandoLeyes(true);

    const timeout = setTimeout(async () => {
      try {
        const data = await votacionesRepository.buscarVotaciones(texto, 15);
        setLeyesChilenas(data);
      } catch (error) {
        console.error("Error buscando votaciones:", error);
        setLeyesChilenas([]);
      } finally {
        setBuscandoLeyes(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!habilitarTransicion) return;
    if (!datosListos) return;
    if (pausado) return;
    if (botonActivo === 3 && proyectoActivo < votacionesPorSesion.length - 1)
      return;

    if (botonActivo > 3) {
      setProyectoActivo(0);
      setHoyActivo(false);
      setBotonActivo(1);
      setHabilitarTransicion(false);
      return;
    }

    const timeout = setTimeout(
      () => {
        setBotonActivo((prev) => prev + 1);
        if (botonActivo === 3) setProyectoActivo(0); //mostrar info acumulada
      },

      2000,
    );

    return () => clearTimeout(timeout);
  }, [botonActivo, habilitarTransicion, datosListos, pausado, proyectoActivo]);

  useEffect(() => {
    if (botonActivo !== 3) return;
    if (pausado) return;

    const timeout = setTimeout(() => {
      setProyectoActivo((prev) =>
        prev + 1 >= votacionesPorSesion.length ? 0 : prev + 1,
      );
    }, 2000);

    return () => clearTimeout(timeout);
  }, [botonActivo, proyectoActivo, pausado]);

  // Modo especial cuando el usuario selecciona una votación desde el buscador.
  // En este modo no existe animación y solo se muestra una votación.
  const handlePress = (botonActivo) => {
    if (votacionBuscada && botonActivo === 3) {
      setVotacionBuscada(null);
      setHabilitarTransicion(false);
      setPausado(false);
      setProyectoActivo(0);
      setBotonActivo(3);
      setLeyActual({ fecha: "", nombre: "" });
      return;
    }

    setVotacionBuscada(null);
    setHabilitarTransicion(false);
    setPausado(false);
    setBotonActivo(botonActivo);

    if (botonActivo === 3) {
      setLeyActual({ fecha: "", nombre: "" });
    }
  };

  const renderGridItem = ({ item }) => (
    <RepresentantePartido item={getRepresentanteViewData(item)} />
  );
  const borderColor = coloresPorPartido[infoModal.partido] || "#000";

  const navigation = useNavigation();

  const handlePressNavigate = (partidoId) => {
    navigation.navigate("EstadisticaPartido", { partidoId });
  };

  const handlePressPause = () => {
    setPausado((prev) => !prev);
  };

  const handlePressAnterior = () => {
    if (botonActivo === 3) {
      if (proyectoActivo > 0) {
        setProyectoActivo((prev) => prev - 1);
      } else {
        setBotonActivo(2);
        setProyectoActivo(0);
      }
      return;
    }

    setBotonActivo((prev) => {
      const anterior = prev - 1;
      return anterior < 1 ? 1 : anterior;
    });
  };

  const handlePressSiguiente = () => {
    if (botonActivo === 3) {
      if (proyectoActivo < votacionesPorSesion.length - 1) {
        setProyectoActivo((prev) => prev + 1);
      } else {
        setProyectoActivo(0);
        setBotonActivo(1);
        setHoyActivo(false);
        setHabilitarTransicion(false);
      }
      return;
    }

    setBotonActivo((prev) => {
      const siguiente = prev + 1;
      return siguiente > 3 ? 3 : siguiente;
    });
  };

  const esProyectoEspecifico =
    botonActivo === 3 && (habilitarTransicion || votacionBuscada);

  const idVotacionActual = esProyectoEspecifico
    ? votacionesPorSesion[proyectoActivo]?.id
    : null;

  const reaccionActual = idVotacionActual
    ? reaccionesLey[idVotacionActual]
    : null;

  const skeletonCard = () => (
    <View
      style={{
        flexDirection: "row",
        width: 240,
        alignSelf: "flex-start",
        alignItems: "center",
        marginVertical: 4,
      }}
    >
      <Skeleton width={26} height={26} borderRadius={100} />
      <View style={{ marginHorizontal: 12 }}>
        <Skeleton width={100} height={15} borderRadius={4} />
      </View>
    </View>
  );

  const getTextoInfoEstadistica = () => {
    switch (botonActivo) {
      case 0:
      case 1:
        if (!datosListos) {
          return (
            <View style={styles.infoEstadistica}>
              <Skeleton width={220} height={24} borderRadius={4} />
            </View>
          );
        }

        return habilitarTransicion
          ? `Sesión ${getNumeroSesionActual()}: ${votacionesPorSesion[0]?.fecha}`
          : "Acumulada período 2026-2030";
        break;

      case 2:
        return habilitarTransicion
          ? `Sesión ${getNumeroSesionActual()}: ${votacionesPorSesion[0]?.fecha}`
          : "Acumuladas período 2026-2030";
        break;

      case 3:
        return esProyectoEspecifico ? (
          <View style={styles.resultadoEstilo}>
            <MaterialCommunityIcons
              name="chart-donut-variant"
              size={25}
              color={COLORS.greenM}
            />
            <Text style={styles.resultado}>
              {votacionesPorSesion[proyectoActivo]?.resultado}
            </Text>
          </View>
        ) : (
          `Acumuladas período 2026-2030`
        );
        break;
      default:
        return "Asistencia acumulada período 2026-2030";
        break;
    }
  };
  const proyectoActual = votacionesPorSesion[proyectoActivo];

  const esMateriaResumen = !!proyectoActual?.materia_resumen;

  const esArticuloResumen = !!proyectoActual?.articulo_resumen;

  const materiaActual =
    proyectoActual?.materia_resumen || proyectoActual?.materia || "";

  const articuloActual =
    proyectoActual?.articulo_resumen || proyectoActual?.articulo || "";

  const tieneArticulo = articuloActual.trim().length > 0;

  const getSubtituloEstadistica = () => {
    switch (botonActivo) {
      case 0:
      case 1:
        if (!datosListos) {
          return (
            <View style={styles.subtitulo}>
              <Skeleton width={220} height={24} borderRadius={4} />
            </View>
          );
        }

        return habilitarTransicion
          ? `Total camara: ${asistenciaSesionGlobal?.porcentaje}%`
          : `Total camara: ${asistenciaGlobal}%`;
        break;
      case 2:
        return habilitarTransicion
          ? `Total camara: ${votacionSesionGlobal?.porcentaje}%`
          : `Total camara: ${participacionHistoricaGlobal}%`;
        break;
      case 3:
        if (esProyectoEspecifico) {
          return (
            <View>
              {materiaActual ? (
                <View
                  style={[
                    styles.leyesEstilo,
                    !tieneArticulo && styles.leyesEstiloSoloMateria,
                  ]}
                >
                  <Text style={styles.materia}>
                    {materiaActual}
                    {esMateriaResumen && (
                      <Text style={styles.resumenIA}> ✨Resumen IA</Text>
                    )}
                  </Text>
                </View>
              ) : null}

              {tieneArticulo ? (
                <View style={styles.leyesEstilo}>
                  <Text style={styles.articulo}>
                    {articuloActual}
                    {esArticuloResumen && (
                      <Text style={styles.resumenIA}> ✨Resumen IA</Text>
                    )}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        }

        return `Total Cámara: ${mocionesHistoricasGlobal}`;
        break;
      default:
        return "Total camara: %";
        break;
    }
  };

  return (
    <View style={styles.container}>
      {search.length > 0 ? (
        <SearchResults
          data={leyesChilenas}
          onSelect={handleResultPress}
          loading={buscandoLeyes}
        />
      ) : (
        <>
          <View style={styles.informacion}>
            <View style={styles.estadistica}>
              <TouchableOpacity
                style={[
                  styles.estadistica2,
                  (botonActivo < 2 || botonActivo === 4) && styles.activeButton,
                ]}
                width={responsiveSize(105)}
                height={responsiveSize(30)}
                onPress={() => handlePress(1)}
              >
                <MaterialIcons
                  name="event-available"
                  size={responsiveIcon(20)}
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
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                >
                  Asistencia
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.estadistica2,
                  botonActivo === 2 && styles.activeButton,
                ]}
                width={responsiveSize(112)}
                height={responsiveSize(30)}
                onPress={() => handlePress(2)}
              >
                <MsIcon
                  icon={msPersonRaisedHand}
                  size={responsiveIcon(20)}
                  color={botonActivo === 2 ? COLORS.back : COLORS.greyM}
                />
                <Text
                  style={[
                    styles.textHoy,
                    botonActivo === 2 && styles.activeText,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                >
                  Votaciones
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.estadistica2,
                  botonActivo === 3 && styles.activeButton,
                ]}
                width={responsiveSize(104)}
                height={responsiveSize(30)}
                onPress={() => handlePress(3)}
              >
                <MsIcon
                  icon={msCloudUpload}
                  size={responsiveIcon(20)}
                  color={botonActivo === 3 ? COLORS.back : COLORS.greyM}
                />
                <Text
                  style={[
                    styles.textHoy,
                    botonActivo === 3 && styles.activeText,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                >
                  Proyectos
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.infoBloque,
              esProyectoEspecifico
                ? styles.infoBloqueProyecto
                : styles.infoBloqueCentrado,
            ]}
          >
            <Text style={styles.infoEstadistica}>
              {getTextoInfoEstadistica()}
            </Text>

            <Text style={styles.subtitulo}>{getSubtituloEstadistica()}</Text>

            {!esProyectoEspecifico && (
              <Text style={styles.textInfo}>
                {leyActual?.nombre !== "" && (
                  <Text style={styles.textLey}>{leyActual.nombre}:</Text>
                )}
                <Text style={styles.textDescripcion}>
                  {" "}
                  {leyActual.descripcion}
                </Text>
              </Text>
            )}
          </View>
          {idVotacionActual && (
            <View flexDirection={"row"}>
              <TouchableOpacity
                style={styles.reaccionDislike}
                onPress={() => setReaccionLey(idVotacionActual, "dislike")}
              >
                <FontAwesome
                  name="thumbs-down"
                  size={responsiveIcon(25)}
                  color={
                    reaccionActual === "dislike" ? COLORS.greenM : COLORS.grey
                  }
                  style={{ transform: [{ scaleX: -1 }] }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reaccionLike}
                onPress={() => setReaccionLey(idVotacionActual, "like")}
              >
                <FontAwesome
                  name="thumbs-up"
                  size={responsiveIcon(25)}
                  color={
                    reaccionActual === "like" ? COLORS.greenM : COLORS.grey
                  }
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.camara}>
            {pelotas}
            {infoPartidos}
          </View>

          {esProyectoEspecifico && (
            <View style={styles.sesionProyecto}>
              <Text style={styles.sesionFecha}>
                Sesión {getNumeroSesionActual()}:{" "}
                {votacionesPorSesion[0]?.fecha}
              </Text>
            </View>
          )}

          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.overlay}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setModalVisible(false)}
              />

              <View style={styles.modalContainer}>
                <View style={styles.tituloContainer}>
                  <View style={styles.tituloContainerText}>
                    <MsIcon
                      icon={infoModal.icon}
                      size={18}
                      color={COLORS.back}
                    />
                    <Text style={styles.tituloText}>{infoModal.tipo}</Text>
                  </View>
                  <Text style={styles.subTituloText}>{infoModal.tiempo}</Text>
                </View>
                <View style={styles.conteiner2}>
                  <TouchableOpacity
                    style={styles.botonPartido}
                    onPress={() =>
                      handlePressNavigate(
                        //infoModal.partido,
                        //console.log('partido', infoModal.partido),
                        infoModal.partidoId,
                      )
                    }
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
                        {infoModal.value}
                        {infoModal.suffix}
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
                  {loading ? (
                    <FlatList
                      style={{ marginTop: 5 }}
                      data={[1, 2, 3]}
                      renderItem={skeletonCard}
                      numColumns={1}
                      keyExtractor={(item) => item.toString()}
                    />
                  ) : (
                    <FlatList
                      data={legisladores.diputados}
                      renderItem={renderGridItem}
                      numColumns={1}
                      scrollEnabled={true}
                      style={{ flexGrow: 0, marginTop: 5, marginVertical: 15 }}
                      keyboardShouldPersistTaps="handled"
                    />
                  )}
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={calendarVisible}
            animationType="fade"
            transparent
            onRequestClose={cerrarCalendario}
          >
            <Pressable
              style={styles.modalBackground}
              onPress={cerrarCalendario}
            >
              <Pressable
                style={styles.calendarModal}
                onPress={(event) => event.stopPropagation()}
              >
                <View style={styles.calendarHandle} />

                <View style={styles.calendarHeader}>
                  <View style={styles.calendarHeaderIcon}>
                    <MaterialIcons
                      name="calendar-month"
                      size={27}
                      color={COLORS.greenM}
                    />
                  </View>

                  <View style={styles.calendarHeaderText}>
                    <Text style={styles.calendarTitle}>
                      Calendario de sesiones
                    </Text>

                    <Text style={styles.calendarSubtitle}>
                      Selecciona una fecha y una sesión
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.calendarCloseButton}
                    onPress={cerrarCalendario}
                  >
                    <Ionicons name="close" size={24} color={COLORS.greenM} />
                  </TouchableOpacity>
                </View>

                <View style={styles.calendarCard}>
                  {calendarLoading ? (
                    <View style={styles.calendarLoading}>
                      <ActivityIndicator size="large" color={COLORS.greenM} />
                    </View>
                  ) : (
                    <>
                      <Calendar
                        markedDates={calendarData.markedDates}
                        onDayPress={seleccionarDia}
                        dayComponent={({ date, state }) => {
                          const sesiones =
                            calendarData.sesiones[date.dateString];

                          const tieneSesion = !!sesiones;
                          const cantidadSesiones = sesiones?.length ?? 0;
                          const deshabilitado = state === "disabled";

                          return (
                            <TouchableOpacity
                              disabled={!tieneSesion}
                              onPress={() => seleccionarDia(date)}
                              style={[
                                styles.calendarDay,
                                tieneSesion && styles.calendarDayMarked,
                                cantidadSesiones === 2 &&
                                  styles.calendarDayMarkedDouble,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.calendarDayText,
                                  deshabilitado &&
                                    styles.calendarDayTextDisabled,
                                  tieneSesion && styles.calendarDayTextMarked,
                                  cantidadSesiones === 2 &&
                                    styles.calendarDayTextDouble,
                                ]}
                              >
                                {date.day}
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

                          textDayFontSize: 14,
                          textMonthFontSize: 17,
                          textDayHeaderFontSize: 12,
                        }}
                      />

                      <View style={styles.calendarLegend}>
                        <View style={styles.calendarLegendItem}>
                          <View
                            style={[
                              styles.calendarLegendDot,
                              styles.calendarLegendDotOne,
                            ]}
                          />
                          <Text style={styles.calendarLegendText}>
                            1 sesión
                          </Text>
                        </View>

                        <View style={styles.calendarLegendItem}>
                          <View
                            style={[
                              styles.calendarLegendDot,
                              styles.calendarLegendDotTwo,
                            ]}
                          />
                          <Text style={styles.calendarLegendText}>
                            2 sesiones
                          </Text>
                        </View>

                        <View style={styles.calendarLegendItem}>
                          <View
                            style={[
                              styles.calendarLegendDot,
                              styles.calendarLegendDotDisabled,
                            ]}
                          />
                          <Text style={styles.calendarLegendText}>
                            Sin sesiones
                          </Text>
                        </View>
                      </View>
                    </>
                  )}

                  {sesionesDia.length > 0 && (
                    <View style={styles.sesionesContainer}>
                      <View style={styles.sesionesHeader}>
                        <View style={styles.sesionesHeaderIcon}>
                          <MaterialIcons
                            name="format-list-bulleted"
                            size={21}
                            color={COLORS.greenM}
                          />
                        </View>

                        <View>
                          <Text style={styles.sesionesTitulo}>
                            Sesiones disponibles
                          </Text>

                          <Text style={styles.sesionesCantidad}>
                            {sesionesDia.length}{" "}
                            {sesionesDia.length === 1
                              ? "sesión disponible"
                              : "sesiones disponibles"}
                          </Text>
                        </View>
                      </View>

                      {sesionesDia.map((sesion) => (
                        <Pressable
                          key={sesion.numero_sesion}
                          onPress={() => seleccionarSesion(sesion)}
                          style={({ pressed }) => [
                            styles.sesionCard,
                            pressed && styles.sesionCardPressed,
                          ]}
                        >
                          <View style={styles.sesionCardAccent} />

                          <View style={styles.sesionCardIcon}>
                            <MaterialIcons
                              name={
                                sesion.tipo === "Especial"
                                  ? "event-note"
                                  : "event-available"
                              }
                              size={22}
                              color={COLORS.greenM}
                            />
                          </View>

                          <View style={styles.sesionCardContent}>
                            <Text style={styles.sesionNumero}>
                              Sesión N°{sesion.numero_sesion}
                            </Text>

                            <Text style={styles.sesionTipo}>{sesion.tipo}</Text>
                          </View>

                          <Ionicons
                            name="chevron-forward"
                            size={21}
                            color={COLORS.greenM}
                          />
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </Pressable>
            </Pressable>
          </Modal>

          <View style={styles.botonCalendar}>
            {habilitarTransicion && !pausado && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.iconoAnimacionActiva,
                  {
                    opacity: pulseOpacity,
                    transform: [{ scale: pulseScale }],
                  },
                ]}
              >
                <Ionicons
                  name="play-forward"
                  size={80}
                  color={COLORS.verdeclaro}
                />
              </Animated.View>
            )}
            {habilitarTransicion ? (
              <View style={styles.containerPlay}>
                <Animated.View
                  style={{
                    position: "absolute",
                    transform: [
                      { translateX: shimmerTranslate },
                      { rotate: "18deg" },
                    ],
                  }}
                >
                  <LinearGradient
                    colors={[
                      "rgba(218,241,222,0.00)",
                      "rgba(218,241,222,0.08)",
                      "rgba(218,241,222,0.20)",
                      "rgba(218,241,222,0.38)",
                      "rgba(218,241,222,0.55)",
                      "rgba(218,241,222,0.38)",
                      "rgba(218,241,222,0.20)",
                      "rgba(218,241,222,0.08)",
                      "rgba(218,241,222,0.00)",
                    ]}
                    locations={[0, 0.12, 0.24, 0.38, 0.5, 0.62, 0.76, 0.88, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.playShimmer}
                  />
                </Animated.View>
                <TouchableOpacity
                  style={[styles.botonPlay]}
                  onPress={handlePressAnterior}
                >
                  <Ionicons
                    name="play-skip-back-circle-outline"
                    size={responsiveIcon(28)}
                    color={COLORS.back}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botonPlay]}
                  onPress={handlePressPause}
                >
                  <Ionicons
                    name={
                      pausado ? "play-circle-outline" : "pause-circle-outline"
                    }
                    size={responsiveIcon(35)}
                    color={COLORS.back}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botonPlay]}
                  onPress={handlePressSiguiente}
                >
                  <Ionicons
                    name="play-skip-forward-circle-outline"
                    size={responsiveIcon(28)}
                    color={COLORS.back}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.containerCalendar, hoyActivo]}
                onPress={abrirCalendario}
              >
                <MsIcon
                  icon={msCalendarMonth}
                  size={responsiveIcon(20)}
                  color={COLORS.back}
                />
                <Text style={[styles.textCalendar, hoyActivo]}>
                  Calendario Sesiones
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
    width: "75%",
    maxHeight: "90%",
    backgroundColor: COLORS.back,
    borderRadius: 10,
  },
  iconoAnimacionActiva: {
    position: "absolute",
    right: -104,
    bottom: -20,
    zIndex: 1,
    elevation: 1,
  },
  reaccionDislike: {
    top: "1%",
    left: "-40%",
  },

  reaccionLike: {
    top: "1%",
    right: "-40%",
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
  leyesEstilo: {
    width: "98%",
  },
  leyesEstiloSoloMateria: {
    minHeight: responsiveVerticalSize(96),
  },
  infoBloque: {
    width: "100%",
    alignItems: "center",
  },

  infoBloqueCentrado: {
    minHeight: responsiveVerticalSize(115),
    justifyContent: "center",
  },

  infoBloqueProyecto: {
    minHeight: 115,
    justifyContent: "flex-start",
  },
  botonCalendar: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    zIndex: 2,
  },
  sesionCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  containerHoy: {
    flexDirection: "row",
    backgroundColor: COLORS.greenM,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    elevation: 3,
    shadowColor: COLORS.black,
  },
  containerCalendar: {
    flexDirection: "row",
    backgroundColor: COLORS.greenM,
    height: responsiveSize(38),
    paddingHorizontal: responsiveSpacing(14),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: responsiveSize(8),
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOpacity: 0.18,
  },
  calendarModal: {
    width: "100%",
    maxWidth: 390,
    maxHeight: "92%",
    backgroundColor: COLORS.back,
    borderRadius: 24,
    paddingTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,

    elevation: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  calendarHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.verdeclaro,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  calendarTitle: {
    fontSize: 18,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
    lineHeight: 24,
  },
  calendarSubtitle: {
    fontSize: 13,
    fontFamily: "NotoSansMyanmar_400Regular",
    color: COLORS.greyM,
    lineHeight: 18,
  },
  calendarCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.verdeclaro,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarCard: {
    borderWidth: 1,
    borderColor: "#E6EAE7",
    borderRadius: 20,
    backgroundColor: COLORS.back,
    overflow: "hidden",
  },
  calendarLoading: {
    minHeight: 330,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarDay: {
    width: 31,
    height: 31,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarDayMarked: {
    backgroundColor: COLORS.greenM,
  },

  calendarDayMarkedDouble: {
    backgroundColor: COLORS.verdeclaro,
  },

  calendarDayText: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "NotoSansMyanmar_400Regular",
  },

  calendarDayTextDisabled: {
    color: COLORS.grey,
  },

  calendarDayTextMarked: {
    color: COLORS.back,
    fontFamily: "NotoSansMyanmar_700Bold",
  },

  calendarDayTextDouble: {
    color: COLORS.greenM,
    fontFamily: "NotoSansMyanmar_700Bold",
  },
  calendarLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: "#ECEFEC",
  },
  calendarLegendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  calendarLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  calendarLegendDotOne: {
    backgroundColor: COLORS.greenM,
  },

  calendarLegendDotTwo: {
    backgroundColor: COLORS.verdeclaro,
    borderWidth: 1,
    borderColor: COLORS.greenM,
  },

  calendarLegendDotDisabled: {
    backgroundColor: COLORS.grey,
  },

  calendarLegendText: {
    fontSize: 11,
    fontFamily: "NotoSansMyanmar_400Regular",
    color: COLORS.greyM,
  },

  sesionesContainer: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: "#ECEFEC",
  },

  sesionesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sesionesHeaderIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.verdeclaro,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  sesionesTitulo: {
    fontSize: 15,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
    lineHeight: 20,
  },

  sesionesCantidad: {
    fontSize: 12,
    fontFamily: "NotoSansMyanmar_400Regular",
    color: COLORS.greyM,
    lineHeight: 17,
  },

  sesionCard: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.back,
    borderWidth: 1,
    borderColor: "#E7EBE8",
    borderRadius: 14,
    marginBottom: 10,
    paddingRight: 14,
    overflow: "hidden",

    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  sesionCardPressed: {
    transform: [{ scale: 0.985 }],
    backgroundColor: "#F7FBF8",
  },

  sesionCardAccent: {
    width: 5,
    alignSelf: "stretch",
    backgroundColor: COLORS.greenM,
  },

  sesionCardIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.verdeclaro,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
  },

  sesionCardContent: {
    flex: 1,
  },

  sesionNumero: {
    fontSize: 15,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.black,
    lineHeight: 20,
  },

  sesionTipo: {
    fontSize: 13,
    fontFamily: "NotoSansMyanmar_600SemiBold",
    color: COLORS.greenM,
    lineHeight: 18,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.48)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  containerPlay: {
    flexDirection: "row",
    borderRadius: responsiveSize(20),
    width: responsiveSize(140),
    height: responsiveSize(40),
    elevation: 3,
    shadowColor: COLORS.black,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.greenM,
    overflow: "hidden",
    zIndex: 2,
    elevation: 2,
  },
  playShimmer: {
    width: 100,
    height: 100,
  },
  informacion: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 12,
  },
  botonPlay: {
    backgroundColor: COLORS.greenM,
    marginHorizontal: 4,
  },
  textHoy: {
    fontSize: responsiveFont(14.7),
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greyM,
    paddingVertical: 0,
    paddingBottom: 0,
    paddingTop: 0,
    marginHorizontal: 8,
    letterSpacing: 0.25,
  },
  textCalendar: {
    fontSize: responsiveFont(14.5),
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.back,
    paddingVertical: 0,
    paddingBottom: 0,
    paddingTop: 0,
    marginLeft: 10,
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
    paddingHorizontal: responsiveSpacing(10),
    height: responsiveSize(36),
  },
  subtitulo: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(14.5),
    color: COLORS.black,
    textAlign: "center",
    lineHeight: 20,
  },
  materia: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFontCamara(13.5, 12),
    color: COLORS.black,
    textAlign: "center",
    lineHeight: responsiveFontCamara(15, 13),
  },
  articulo: {
    fontFamily: "NotoSansMyanmar_400Regular",
    paddingTop: 3,
    fontSize: responsiveFontCamara(13, 12),
    color: COLORS.black,
    lineHeight: responsiveFontCamara(15, 13),
    textAlign: "center",
  },
  resultadoEstilo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sesionProyecto: {
    position: "absolute",
    bottom: responsiveVerticalSize(56),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  resultado: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(15),
    color: COLORS.greenM,
    paddingHorizontal: 3,
    textTransform: "uppercase",
    letterSpacing: 0.25,
  },
  sesionFecha: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(15),
    color: COLORS.greenM,
    letterSpacing: 0.25,
  },
  infoEstadistica: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(15),
    color: COLORS.greenM,
    marginTop: "2%",
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
    height: 65,
    width: "100%",
    backgroundColor: COLORS.greenM,
    justifyContent: "center",
    alignItems: "center",
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
    paddingTop: 4,
  },
  tituloContainerText: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tituloText: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 16,
    color: COLORS.back,
    lineHeight: 22,
    alignSelf: "center",
    letterSpacing: 0.4,
    marginLeft: 6,
    width: 100,
  },
  subTituloText: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.back,
    lineHeight: 24,
    alignSelf: "center",
    letterSpacing: 0.3,
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
    borderRadius: 30,
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
  resumenIA: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: responsiveFont(11.5),
    color: COLORS.greyM,
  },
});
