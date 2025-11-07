import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useState, useEffect } from "react";
import { ref, set, update, onValue, remove } from "firebase/database";
import { db } from "../constants/config";

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

const GridRepresent = ({ item, onSelected }) => {
  const borderColor = coloresPorPartido[item.partido] || "#000";

  const [asistencia, setAsistencia] = useState('90');
  const [votacion, setVotacion] = useState('80');
  const [comision, setComision] = useState('5');
  const [mocion, setMocion] = useState('15');
  const [proyectos, setProyectos] = useState('3/5');

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
              width: 82,
              height: 82,
              borderRadius: 100,
              borderWidth: 3.8,
            }}
            source={item.foto}
          />
          <Text style={styles.partido}>{item.partido}</Text>
        </View>
        <View style={styles.infoEscrita}>
            <View flexDirection={"row"} alignItems={"center"}>
                <Text style={styles.name}>{item.nombre}</Text>
                <View style={styles.icono} marginTop={'-1%'} >
                    <MaterialIcons name="favorite" size={34} color={COLORS.grey} />
                        <View position={'absolute'} marginTop={'-10%'}> 
                            <Text style={styles.porcentaje}>30%</Text>
                        </View>
                </View>
            </View>
          <View style={styles.containerInfo}>
            <View>
              <View flexDirection={"row"} alignItems={"center"} >
                <MaterialIcons
                  name="event-available"
                  size={17}
                  color={COLORS.black}
                />
                <Text style={styles.informacion}>{asistencia}% de asistencia </Text>
              </View>
              <View flexDirection={"row"} alignItems={"center"} >
                <MaterialIcons
                  name="how-to-vote"
                  size={17}
                  color={COLORS.black}
                />
                <Text style={styles.informacion}>{votacion}% de votaciones </Text>
              </View>
            </View>
            <View style={styles.info}>
              <View>
                <View flexDirection={"row"} alignItems={"center"} >
                  <MaterialIcons
                    name="diversity-2"
                    size={17}
                    color={COLORS.black}
                  />
                  <Text style={styles.informacion} marginLeft={'1%'}>{comision} comisiones</Text>
                </View>
                <View flexDirection={"row"} alignItems={"center"} >
                  <MaterialIcons
                    name="addchart"
                    size={17}
                    color={COLORS.black}
                  />
                  <Text style={styles.informacion}>{mocion} mociones </Text>
                </View>
              </View>
            </View>
          </View>
          <View flexDirection={"row"} alignItems={"center"} marginHorizontal= {"1%"} marginLeft={'2%'}> 
            <MaterialIcons
              name="assignment-turned-in"
              size={17}
              color={COLORS.black}
            />
            <Text style={styles.informacionProyectos}>{proyectos} Proyectos aprobados vs presentados
            </Text>
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
    width: "95%",
    backgroundColor: COLORS.back,
    elevation: 3,
    shadowColor: COLORS.black,
  },
  containImage: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "2%",
    marginTop: '2%'
  },
  infoEscrita: {
    marginVertical: "2.5%",
  },
  info: {
    marginLeft: "5%",
  },
  name: {
    fontFamily: "NotoSansMyanmar_700Bold",
    fontSize: 20,
    marginLeft: '1%',
    flex: 1,
    maxWidth: "87%",
    color: COLORS.black,
    marginTop: '-2%'
  },
  icono: {
    position: 'relative', 
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: '4%'
  },
  parametros: {
    fontFamily: "NotoSansMyanmar_400Regular",
  },
  informacion: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,
    marginLeft: "4%",
  },
  informacionProyectos: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,
    marginLeft: "2%",
  },
  containerInfo: {
    marginTop: '-0.5%',
    marginVertical: "0.5%",
    marginHorizontal: "1%",
    flexDirection: "row",
    marginLeft: '2%'
  },
});

export default GridRepresent;
