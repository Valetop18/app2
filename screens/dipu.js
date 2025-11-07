import React from "react";
import GridRepresent from "../components/gridRepresents";
import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { COLORS } from "../constants/colors";

export const Diputados = ({navigation}) => {

        const diputados = useSelector(store => store.selectDiputado.filteredDiputados)

        const handleSelected = (item) => {
            navigation.navigate('Descripcion', {
                diputado: item,
            })
        }

        const renderGridItem = ({item}) => (
            <GridRepresent item={item} onSelected={handleSelected} />
        )
    
        return (
            <><View style={styles.back}></View>
                <FlatList 
                style={styles.container}
                data={diputados}
                renderItem={renderGridItem}
                numColumns={1}
                keyExtractor={item => item.id}
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
    container: {
        marginTop: 5,
    }
})

