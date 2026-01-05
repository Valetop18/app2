import React from "react";
import { GridLeyes } from "../components/leyes";
import { FlatList, StyleSheet, View } from "react-native";
import { useState, useContext, useEffect } from "react";
import { COLORS } from "../constants/colors";
import { LEYES } from "../data/leyes";
import Buscador from "../components/Buscador";
import { BuscadorContext } from "../context/BuscadorContext";

export const Leyes = ({navigation}) => {

        const [leyesChilenas, setLeyesChilenas] = useState(LEYES);
        const {search, setSearch} = useContext(BuscadorContext);

        const handleSelected = (item) => {
            navigation.navigate('LeyCompleta', {
                ley: item,
            })
        }

        const filtrarLeyes = (texto) => {
            const leyesFiltradas = LEYES.filter((ley) => {
                const nombreLey = ley.nombre ? ley.nombre.toUpperCase() : "";
                const descLey = ley.descripcion
                ? ley.descripcion.toUpperCase()
                : "";
                const textUpper = texto.toUpperCase();
                return (
                nombreLey.includes(textUpper) || descLey.includes(textUpper)
                );
            });
            setLeyesChilenas(leyesFiltradas);
            return leyesFiltradas;
        };

        useEffect(() => {
          filtrarLeyes(search);
        }, [search]);

        const renderGridItem = ({item}) => (
            <GridLeyes item={item}/>
        )
    
        return (
            <><View style={styles.back}></View>
            <View style={styles.buscador}>
            <Buscador />
            </View>
                <FlatList 
                style={styles.container}
                data={leyesChilenas}
                renderItem={renderGridItem}
                numColumns={1}
                keyExtractor={(item) => item.id}
                />
            </>
        )
}

const styles = StyleSheet.create({
    back: {
        backgroundColor: COLORS.back,
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    buscador: {
        width: "96%",
        alignSelf: 'center'
    },
    container: {
        marginTop: 5,
    }
})

