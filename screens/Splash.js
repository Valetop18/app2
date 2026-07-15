import { View, Text, StyleSheet} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from '../constants/colors'
import { useFonts, Sedan_400Regular } from "@expo-google-fonts/sedan";


export const Splash = ( { navigation } ) => {

    const dispatch = useDispatch();
    const { user } = useSelector( state => state.auth );

    useEffect(()=> {

        const checkAuth = async () => {

            console.log('user auth: ', user);
            const isAuthenticated = !!user;
            if (!isAuthenticated) {
                navigation.replace('Login')
            }

        }

        setTimeout(checkAuth, 3000);




    }, [user]);

    useEffect(() => {

        console.log('cargando data')

    const loadData = async () => {
        try {
            const emailGuardado = await AsyncStorage.getItem('email');
            const passGuardado = await AsyncStorage.getItem('pass');

            console.log(emailGuardado)
            console.log(passGuardado)

            if (emailGuardado && passGuardado ) {
               // dispatch( login(emailGuardado, passGuardado) )
               

            }else{
                //navigation.replace('Login')
            }

        } catch (error) {
            console.log('Error al cargar credenciales: ', error);
        }
    }

    loadData();

    }, []);

    
    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.nombre}>nawi</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingVertical: '15%',
        paddingHorizontal: '5%',
        backgroundColor: COLORS.greenM,
        alignContent: 'center'
    },
    nombre: {
        color: 'white',
        fontFamily: 'Sedan_400Regular',
        fontSize: 120,
        letterSpacing: 8,
    },
    title:{
        justifyContent: 'flex-end',
        alignItems: 'center',
        height:'60%',
        marginRight: '4%'
    }
})