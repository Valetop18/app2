import React from "react";
import { View, StyleSheet } from "react-native";
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
        'DEM': COLORS.DEM
}

export const Desk = ({partido, left, top}) => {
    const backgroundColor = coloresPorPartido[partido] || '#000';
    return (
        <View
            style={{
                width: 20,
                height: 20,
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

