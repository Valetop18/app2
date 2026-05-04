import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

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
        'DEM': COLORS.DEM
}

export const DeskSena = ({partido, left, top}) => {
    const backgroundColor = coloresPorPartido[partido] || '#000';
    return (
        <View
            style={{
                width: 25,
                height: 25,
                backgroundColor,
                borderRadius: 100,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                left,
                top
            }}
        />    
    )
}

