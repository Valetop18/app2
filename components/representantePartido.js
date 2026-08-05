import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import Tooltip from "./tooltip";
import { FONTS } from "../constants/fonts";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";

const responsiveRepresentanteSize = (baseValue) => {
  return Math.min(
    responsiveWidthScale(baseValue),
    responsiveHeightScale(baseValue),
  );
};

const responsiveRepresentanteText = (baseValue) => {
  return Math.max(11, responsiveWidthScale(baseValue));
};

const RepresentantePartido = ({ item }) => {
  const TextoDinamico = () => {
    const o = item.text?.toLowerCase();

    if (!o) {
      return null;
    }

    let abreviatura = null;
    let textoTooltip = null;

    if (o.includes("licencia")) {
      abreviatura = "L.Med.";
      textoTooltip = "Licencia médica";
    } else if (o.includes("sin just")) {
      abreviatura = "Sin Just.";
      textoTooltip = "Sin Justificación";
    } else if (o.includes("impedimento")) {
      abreviatura = "I.Grav.";
      textoTooltip = "Impedimento grave";
    } else if (o.includes("motivos particulares sin goce")) {
      abreviatura = "Per.S/G";
      textoTooltip = "Permiso por motivos particulares sin goce de dieta";
    } else if (o.includes("permiso especial comit")) {
      abreviatura = "Per.C/P";
      textoTooltip = "Permiso especial Comités Parlamentarios";
    } else if (o.includes("salida del pa")) {
      abreviatura = "Fue.País";
      textoTooltip = "Salida del país";
    } else if (o.includes("n oficial con aviso de salida")) {
      abreviatura = "Mis.Ofi.";
      textoTooltip = "Misión oficial con aviso de salida del país";
    } else if (o.includes("n encomendada por la corpo")) {
      abreviatura = "Gest.Enc.";
      textoTooltip = "Gestión encomendada por la Corporación";
    } else if (o.includes("acuerdo de comit")) {
      abreviatura = "Acu.Com.";
      textoTooltip = "Acuerdo de Comités Parlamentarios";
    } else if (o.includes("actividad propia de la labor")) {
      abreviatura = "Act.Parl.";
      textoTooltip = "Actividad propia de la labor parlamentaria";
    } else if (o.includes("actividad oficial con el presidente")) {
      abreviatura = "Act.Pres.";
      textoTooltip = "Actividad oficial con el Presidente de la República";
    } else if (o.includes("permiso parental")) {
      abreviatura = "P.Par.";
      textoTooltip = "Permiso parental";
    }

    if (!abreviatura) {
      return null;
    }

    return (
      <Tooltip text={textoTooltip} width={responsiveWidthScale(160)}>
        <Text style={styles.asistencia}>{abreviatura}</Text>
      </Tooltip>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.containImage}>
        <Image style={styles.foto} source={{ uri: item.foto }} />
      </View>
      <Text style={styles.nombre} numberOfLines={1}>
        {item.nombre}
      </Text>

      {item.icon ? (
        <View style={styles.estado}>
          <MaterialIcons
            name={item.icon}
            size={responsiveRepresentanteSize(18)}
            color={item.iconColor}
          />

          {item.text ? TextoDinamico() : null}
        </View>
      ) : (
        <Text style={styles.asistencia}>
          {item.value}
          {item.suffix}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 33,
    flexDirection: "row",
    alignItems: "center",
    marginTop: responsiveRepresentanteSize(5),
    paddingHorizontal: responsiveRepresentanteSize(5),
  },

  containImage: {
    width: 28,
    marginRight: responsiveRepresentanteSize(10),
    alignItems: "center",
    justifyContent: "center",
  },

  foto: {
    width: 28,
    height: 28,
    borderRadius: 100,
  },

  nombre: {
    width: responsiveWidthScale(180),
    marginRight: responsiveWidthScale(6),
    fontFamily: FONTS.regular,
    fontSize: responsiveRepresentanteText(14),
    color: COLORS.black,
    textAlignVertical: "center",
    includeFontPadding: false,
  },

  estado: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  asistencia: {
    flexShrink: 0,
    fontFamily: FONTS.regular,
    fontSize: responsiveRepresentanteText(14),
    color: COLORS.black,
    includeFontPadding: false,
  },
});

export default RepresentantePartido;
