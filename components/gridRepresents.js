import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { COLORS } from "../constants/colors";
import { useState, useEffect } from "react";
import { ref, set, update, onValue, remove } from "firebase/database";
import { db } from "../constants/config";
import { msPersonRaisedHand } from "@material-symbols-react-native/outlined-400";
import { MsIcon } from "material-symbols-react-native";

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

const GridRepresent = ({ item, reaccion, onSelected, handleLike }) => {
  //const isLiked = item
  const borderColor = coloresPorPartido[item.partido] || "#000";

  const [asistencia, setAsistencia] = useState("90");
  const [votacion, setVotacion] = useState("80");
  const [comision, setComision] = useState("5");
  const [mocion, setMocion] = useState("15");
  const [proyectos, setProyectos] = useState("3/5");

  useEffect(() => {
    const starCountRef = ref(db, "diputados/asistencia/" + item.id);
    onValue(starCountRef, (snapshot) => {
      console.log(snapshot.val(item.id));
      setAsistencia(snapshot.val(item.id));
    });
  }, [item.id]);

  useEffect(() => {
    const starCountRef = ref(db, "diputados/votaciones/" + item.id);
    onValue(starCountRef, (snapshot) => {
      console.log(snapshot.val(item.id));
      setVotacion(snapshot.val(item.id));
    });
  }, [item.id]);

  useEffect(() => {
    const starCountRef = ref(db, "diputados/proyectos/" + item.id);
    onValue(starCountRef, (snapshot) => {
      console.log(snapshot.val(item.id));
      setProyectos(snapshot.val(item.id));
    });
  }, [item.id]);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => onSelected(item)}
        style={{ ...styles.container }}
      >
        <View style={styles.containImage}>
          <Image
            style={{
              borderColor,
              width: 76,
              height: 76,
              borderRadius: 100,
              borderWidth: 3,
            }}
            source={{uri: item.foto}}
          />
          <Text style={styles.partido}>{item.partido}</Text>
        </View>
        <View style={styles.infoEscrita}>
          <View flexDirection={"row"} alignItems={"center"}>
            <Text style={styles.name}>{item.nombre}</Text>
            <TouchableOpacity style={styles.icono} marginTop={"-1%"} onPress={() => handleLike(item.id, 'like')}>
              <MaterialIcons name="favorite" size={22} color={ reaccion === "like" ? COLORS.greenM : COLORS.grey} />
            </TouchableOpacity>
          </View>
          <View style={styles.containerInfo}>
            <View>
              <View flexDirection={"row"} alignItems={"center"}>
                <MaterialIcons
                  name="event-available"
                  size={17}
                  color={COLORS.greenM}
                />
                <Text style={styles.informacion}>
                  {asistencia}% Asistencia{" "}
                </Text>
              </View>
              <View
                flexDirection={"row"}
                alignItems={"center"}
                marginTop={"2.5%"}
              >
                <MsIcon
                  icon={msPersonRaisedHand}
                  size={18}
                  color={COLORS.greenM}
                />
                <Text style={styles.informacion}>{votacion}% Votaciones </Text>
              </View>
            </View>
            <View style={styles.info}>
              <View>
                <View flexDirection={"row"} alignItems={"center"}>
                  <MaterialIcons
                    name="diversity-2"
                    size={17}
                    color={COLORS.greenM}
                  />
                  <Text style={styles.informacion} marginLeft={"1%"}>
                    {comision} comisiones
                  </Text>
                </View>
                <View
                  flexDirection={"row"}
                  alignItems={"center"}
                  marginTop={"2.5%"}
                >
                  <MaterialIcons
                    name="assignment-turned-in"
                    size={17}
                    color={COLORS.greenM}
                  />
                  <Text style={styles.informacion}>{mocion}% efectividad </Text>
                </View>
              </View>
            </View>
            <View style={styles.dataUsage}>
              <MaterialIcons
                name="data-usage"
                size={40}
                color={COLORS.verdeclaro}
                position={'absolute'}
              />
              <Text style={styles.data2}>36%</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: COLORS.back,
  },
  container: {
    marginVertical: "1%",
    display: "flex",
    alignContent: "center",
    flexDirection: "row",
    borderRadius: 10,
    width: "96%",
    backgroundColor: COLORS.back,
    elevation: 3,
    shadowColor: COLORS.black,
  },
  containImage: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "1.5%",
    marginTop: "4.5%",
  },
  infoEscrita: {
    marginVertical: "2.5%",
    width: "74%",
  },
  info: {
    marginLeft: "4%",
  },
  name: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 20,
    marginLeft: "1%",
    flex: 1,
    maxWidth: "87%",
    color: COLORS.black,
    marginTop: "-1.5%",
  },
  icono: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
  },
  porcentaje: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 12,
  },
  partido: {
    fontFamily: "NotoSansMyanmar_700Bold",
    justifyContent: "center",
    alignItems: "center",
    color: COLORS.black,
    fontSize: 14,
    marginTop: "2%",
  },
  parametros: {
    fontFamily: "NotoSansMyanmar_400Regular",
  },
  informacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,
    marginLeft: "2%",
  },
  informacionProyectos: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,
    marginLeft: "2%",
  },
  containerInfo: {
    marginVertical: "2%",
    marginHorizontal: "3%",
    flexDirection: "row",
    marginLeft: "2%",
  },
  dataUsage: {
    alignItems: "center",
    width: 42,
    height: 42,
    justifyContent: "center",
  },
  data2: {
    fontSize: 12,
    fontFamily: "NotoSansMyanmar_700Bold",
    color: COLORS.greenM,
  },
});

export default GridRepresent;
