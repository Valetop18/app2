import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const coloresPorPartido = {
        'DES' : COLORS.DES,
        'PDG': COLORS.PDG,
        'IND': COLORS.IND,
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
        'REP': COLORS.PREP,
        'PNL': COLORS.PNL,
        'PSC': COLORS.PSC,
        'DEM': COLORS.DEM,
}

export const InfoPartido = ({data, left, top, onPress}) => {
    if (!data) return null;
    
    const borderColor = coloresPorPartido[data.partido] || '#000';

    const TextoDinamico = () => {

        if ( data.loading) {
            return data.loadingComponent
        }

        if ( data.icon ){
            return (
                <View style={styles.containerProy}>
                    <MaterialIcons
                        name={data.icon}
                        size={14}
                        color={data.iconColor}
                    />
                    <Text style={{color:data.iconColor, fontFamily:"NotoSansMyanmar_700Bold", fontSize:14}}>
                        {data.value}{data.suffix}
                    </Text>
                </View>
             )
        }

        return (
            <Text style={styles.infoPorcentaje}>
                {data.value}{data.suffix}
            </Text>
        )
    }

    return (
        <TouchableOpacity
            onPress={onPress}
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
            <Text style={styles.infopartido}>{data.partido}</Text>  

            {TextoDinamico()}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
infopartido: {
        fontFamily: 'NotoSansMyanmar_700Bold',
        fontSize: 10,
        color: COLORS.greenM,
        top: 9,
        lineHeight: 15,
    },
    infoPorcentaje: {
        fontFamily: 'NotoSansMyanmar_700Bold',
        color: COLORS.greenM,
        fontSize: 15,
    },
    containerProy: {
        flexDirection: 'row',
        alignItems: 'center', 

    },
    infoPorcentajeProy: {
        fontFamily: 'NotoSansMyanmar_700Bold',
        color: COLORS.greenM,
        fontSize: 14,
    }
})