import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { COLORS } from "../constants/colors";

const coloresPorPartido = {
        'DES' : COLORS.DES,
        'AM': COLORS.AM,
        'PDG': COLORS.PDG,
        'IND': COLORS.IND,
        'PEV': COLORS.PEV,
        'FA' : COLORS.FA,
        'PS': COLORS.PS,
        'PC': COLORS.PC,
        'PPD': COLORS.PPD,
        'PL': COLORS.PL,
        'PR' : COLORS.PR,
        'AH': COLORS.AH,
        'FRVS': COLORS.FRVS,
        'PDC': COLORS.PDC,
        'UDI': COLORS.UDI,
        'RN' : COLORS.RN,
        'EVOPOLI': COLORS.EVOPOLI,
        'PREP': COLORS.PREP,
        'PNL': COLORS.PNL,
        'PSC': COLORS.PSC,
        'PD': COLORS.PD
}

export const InfoPartido = ({partido, porcentaje, left, top}) => {
    const borderColor = coloresPorPartido[partido] || '#000';
    return (
        <View
            style={{
                width: 55,
                height: 55,
                backgroundColor: 'rgba(255, 255, 255, 0.80)',
                borderColor,
                borderRadius: 100,
                borderWidth: 3,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                left,
                top
            }}
        >
            <Text style={styles.infopartido}>{partido}</Text>  
            <Text style={styles.infoPorcentaje}>{porcentaje}</Text>  
        </View>
    )
}

const styles = StyleSheet.create({
infopartido: {
        fontFamily: 'NotoSansMyanmar_700Bold',
        fontSize: 10,
        color: COLORS.greenM,
        top: 5,
    },
    infoPorcentaje: {
        fontFamily: 'NotoSansMyanmar_700Bold',
        color: COLORS.greenM,
        fontSize: 15,
    }
})