import React, {useContext} from 'react'
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { BuscadorContext } from '../context/BuscadorContext'
import Ionicons from '@react-native-vector-icons/ionicons'
import { COLORS } from '../constants/colors'

const Buscador = ({value, onChange}) => {

    const {search, setSearch} = useContext(BuscadorContext);

    return (
    <View style={styles.container}>
        <Ionicons name="search-circle" size={22} color={COLORS.greenM} marginHorizontal={4} marginLeft={10}/>
        <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder='Ingresa una ley o tema de interés.'
            style={styles.input}
            cursorColor={COLORS.black}
        ></TextInput>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.back,
        marginVertical: "0.5%",
        elevation: 3,
        alignItems: 'center',
        shadowColor: COLORS.black,
        borderRadius: 5,
        height: 38,
    },
    input: {
        fontFamily: "NotoSansMyanmar_400Regular",
        fontSize: 12.5,
        color: COLORS.black,
        height: 32,
        alignSelf: 'center', 
        paddingTop: 5,
        height: '100%',
        paddingVertical: 0,
        paddingBottom: 0,
        paddingTop: 0,
        width: '80%'
    }
})

export default Buscador