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

  const obtenerLegisladoresPorPartido = async () => {
    try {
      const data =
        await legisladoresRepository.getDiputadosByPartido(partidoId);
      setDiputados(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getPartido = async () => {
    const data = await partidosRepository.getPartidoById(partidoId);
    console.log("Partido actual: ", data);
    setPartido(data);
  };

  const [asistencia, setAsistencia] = useState();
  const [votacion, setVotacion] = useState();

  const [comision, setComision] = useState("5");
  const [mocion, setMocion] = useState("15");
  const [proyectos, setProyectos] = useState("3/5");

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

  const renderGridItem = ({ item }) => <GridRepresentPartido item={item} />;

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([
        obtenerLegisladoresPorPartido(),
        checkIfIsSaved(),
        getPartido(),
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
                <View flexDirection={"row"} alignItems={"center"}>
                  <MaterialIcons
                    name="event-available"
                    size={20}
                    color={COLORS.black}
                  />
                  <Text style={styles.informacion}>
                    {asistencia}% Asistencia
                  </Text>
                </View>
                <View flexDirection={"row"} alignItems={"center"}>
                  <MsIcon
                    icon={msPersonRaisedHand}
                    size={20}
                    color={COLORS.black}
                  />
                  <Text style={styles.informacion}>{votacion}% Votaciones</Text>
                </View>
                <View flexDirection={"row"} alignItems={"center"}>
                  <MsIcon icon={msCloudUpload} size={20} color={COLORS.black} />
                  <Text style={styles.informacion}>
                    {votacion}% Efectividad
                  </Text>
                </View>
              </View>
              <View marginRight={10}>
                <View style={styles.favorite}>
                  <MaterialIcons
                    name="favorite"
                    size={42}
                    color={isSaved ? COLORS.greenM : COLORS.greyM}
                    position={"absolute"}
                  />
                  <Text style={styles.interes}>36%</Text>
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
              <View width={90} marginVertical={"5%"} alignSelf={"center"}>
                <Text style={styles.label}>
                  Proyectos aprobados/presentados
                </Text>
              </View>
              <View marginVertical={"1%"}>
                <PieChart
                  strokeColor={COLORS.back}
                  strokeWidth={1}
                  donut
                  data={[
                    { value: 20, color: COLORS.verdeclaro },
                    { value: 10, color: COLORS.verdeclaro },
                    { value: 30, color: COLORS.verdeclaro },
                    { value: 5, color: COLORS.verdeclaro },
                    { value: 15, color: COLORS.verdeclaro },
                    { value: 10, color: COLORS.verdeclaro },
                  ]}
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
              </View>

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
                      Porcentaje de votos recibidos
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
                    <Text style={styles.label2}>Índice de cohesión</Text>
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
                      Compatibilidad con el partido
                    </Text>
                  </View>
                </View>
                <View style={styles.container5}>
                  <View style={styles.circulo}>
                    <Text style={styles.data2}>55</Text>
                  </View>
                  <View width={145} marginVertical={"3%"} marginLeft={5}>
                    <Text style={styles.label2}>
                      Lugar estadístico entre los partidos
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <FlatList
            data={diputados}
            renderItem={renderGridItem}
            numColumns={1}
            keyExtractor={(item) => item.id}
          />
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
    marginTop: "4%",
    marginLeft: "-16%",
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
    backgroundColor: COLORS.back
  },
});
