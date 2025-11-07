import React from "react";
import GridSenadores from "../components/gridSenadores";
import { useSelector } from "react-redux";
import { FlatList, StyleSheet, SafeAreaView, StatusBar, View} from "react-native";
import { COLORS } from "../constants/colors";

export const Senadores = ({navigation}) => {

    const senadores = useSelector(store => store.selectSenador.filteredSenadores)

    const handleSelected = (item) => {
        navigation.navigate('Descripcion', {
            senador: item,
        })
    }

        const renderGridItem = ({item}) => (
            <GridSenadores item={item} onSelected={handleSelected}/>
        )
    
        return (
            <><View style={styles.back}></View>
                <FlatList
                    style={styles.container}
                    data={senadores}
                    renderItem={renderGridItem}
                    numColumns={1}
                    keyExtractor={item => item.id} />
            </>
        )
}

const styles = StyleSheet.create({
    back: {
        backgroundColor: COLORS.back,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    container: {
        marginTop: 5,//StatusBar.currentHeight || 0,
    },
})
