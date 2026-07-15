import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const RepresentantePartido = ({ item }) => {

  const TextoDinamico = () => {
  
    const o = item.text.toLowerCase();

          if ( !o) {
              return null
          }
  
          if ( o.includes("licencia") ){
              return (<Text style={styles.asistencia}>L.Med.</Text>);
          }

          if ( o.includes("sin just") ){
              return (<Text style={styles.asistencia}>Sin Just.</Text>);
          }

          if ( o.includes("impedimento") ){
              return (<Text style={styles.asistencia}>I.Grav.</Text>);
          }

          if ( o.includes("motivos particulares sin goce") ){
              return (<Text style={styles.asistencia}>Per.S/G</Text>);
          }

          if ( o.includes("permiso especial comit") ){
              return (<Text style={styles.asistencia}>Per.C/P</Text>);
          }

          if ( o.includes("salida del pa") ){
              return (<Text style={styles.asistencia}>Fue.País</Text>);
          }

          if ( o.includes("n oficial con aviso de salida") ){
              return (<Text style={styles.asistencia}>Mis.Ofi.</Text>);
          }

          if ( o.includes("n encomendada por la corpo") ){
              return (<Text style={styles.asistencia}>Gest.Enc.</Text>);
          }

          if ( o.includes("acuerdo de comit") ){
              return (<Text style={styles.asistencia}>Acu.Com.</Text>);
          }

          if ( o.includes("actividad propia de la labor") ){
              return (<Text style={styles.asistencia}>Act.Parl.</Text>);
          }

          if ( o.includes("actividad oficial con el presidente") ){
              return (<Text style={styles.asistencia}>Act.Pres.</Text>);
          }

          if ( o.includes("permiso parental") ){
              return (<Text style={styles.asistencia}>P.Par.</Text>);
          }
  
  
          return null;
      }

  return (
    <View style={styles.container}>
      <View style={styles.containImage}>
        <Image
          style={{
            width: 28,
            height: 28,
            borderRadius: 100,
          }}
          source={{ uri: item.foto }}
        />
      </View>
      <Text style={styles.nombre}>{item.nombre}</Text>

      {item.icon ? (
        <View flexDirection={"row"} alignItems={'center'}>
          <MaterialIcons name={item.icon} size={18} color={item.iconColor} />
          {item.text ? TextoDinamico() : null  }
        </View>
      ): (
        <Text style={styles.asistencia}>{item.value}{item.suffix}</Text>
      )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 5
  },
  containImage: {
    marginRight: 10,
    width: 28,
    alignSelf: 'flex-start'
  },
  nombre: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,
    alignSelf: "center",
    width: 180,

  },
  asistencia: {
    fontFamily: "NotoSansMyanmar_400Regular",
    fontSize: 14,
    color: COLORS.black,

  },
});

export default RepresentantePartido;
