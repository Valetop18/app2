import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useState, useEffect } from "react";
import { ref, set, update, onValue, remove } from "firebase/database";
import { db } from "../constants/config";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

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
  PD: COLORS.PD,
};

export const DescripcionDiputado = ({ route }) => {
  const [asistencia, setAsistencia] = useState();
  const [votacion, setVotacion] = useState();

  const [comision, setComision] = useState("5");
  const [mocion, setMocion] = useState("15");
  const [proyectos, setProyectos] = useState("3/5");

  useEffect(() => {
    const starCountRef = ref(db, "diputados/asistencia/" + item);
    onValue(starCountRef, (snapshot) => {
      console.log(snapshot.val(item));
      setAsistencia(snapshot.val(item));
    });
  }, [item]);

  useEffect(() => {
    const starCountRef = ref(db, "diputados/votaciones/" + item);
    onValue(starCountRef, (snapshot) => {
      console.log(snapshot.val(route.params.id));
      setVotacion(snapshot.val(item));
    });
  }, [item]);

  useEffect(() => {
    const starCountRef = ref(db, "diputados/proyectos/" + item);
    onValue(starCountRef, (snapshot) => {
      console.log(snapshot.val(route.params.id));
      setProyectos(snapshot.val(item));
    });
  }, [item]);

  const { diputado } = route.params;
  const item = diputado.id;

  const borderColor = coloresPorPartido[diputado.partido] || "#000";

  return (
    <View style={styles.back}>
      <View style={styles.principal}>
        <View style={styles.container1}>
          <Text style={styles.title}>{diputado.nombre}</Text>
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
              source={diputado.foto}
            />
            <Text style={styles.partido}>{diputado.partido}</Text>
          </View>
          <View style={styles.estadistica}>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons
                  name="event-available"
                  size={17}
                  color={COLORS.black}
                />
                <Text style={styles.informacion}>
                  {asistencia}% de asistencia
                </Text>
              </View>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons
                  name="how-to-vote"
                  size={17}
                  color={COLORS.black}
                />
                <Text style={styles.informacion}>
                  {votacion}% de votaciones
                </Text>
              </View>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons
                  name="diversity-2"
                  size={17}
                  color={COLORS.black}
                />
                <Text style={styles.informacion} marginLeft={"1%"}>
                  {comision} comisiones
                </Text>
              </View>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons name="addchart" size={17} color={COLORS.black} />
                <Text style={styles.informacion}>{mocion} mociones </Text>
              </View>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons
                  name="assignment-turned-in"
                  size={17}
                  color={COLORS.black}
                />
                <Text style={styles.informacion}>
                  {proyectos} Proyectos aprobados vs presentados
                </Text>
              </View>
          </View>
        </View>

        <Text style={styles.descripcion}>{diputado.descripcion}</Text>
        <View style={styles.container3}>
          <Text style={styles.title2}>
            Estadísticas de la gestión.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    backgroundColor: COLORS.back,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  principal: {
    marginVertical: "1%",
    marginHorizontal: "2%",
    width: "96%",
    height: "75%",
    backgroundColor: COLORS.back,
    elevation: 3,
    shadowColor: COLORS.black,
    borderRadius: 10,
  },
  container1: {
    marginLeft: "12%",
    marginTop: "1%",
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
  title2: {
    fontSize: 15,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.black,
  },
  container3: {
    marginLeft: "5%",
    marginTop: "2%",
  },
  descripcion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 12,
    textAlign: "justify",
    marginHorizontal: "2%",
    lineHeight: 18,
    top: '1%'
  },
  containerInfo: {
    flexDirection: "row",
  },
  estadistica: {
    marginHorizontal: '2%',
    marginLeft: '6%',
    top: '-3%'
  },
  info: {},
  informacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 13,
    color: COLORS.black,
    maxWidth: "98%",
    marginLeft: '2%'
  },
  container2: {
    maxWidth: "98%",
    marginHorizontal: "2%",
    flexDirection: "row",
    marginLeft: "5%",
    marginVertical: "1%",
  },
  partido: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 14,
    alignSelf: "center",
    marginTop: "2%",
  },
});
