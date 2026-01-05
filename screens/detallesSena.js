import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { COLORS } from "../constants/colors";
import { useState, useEffect } from "react";
import { ref, set, update, onValue, remove } from "firebase/database";
import { db } from "../constants/config";

export const Descripcion = ({ route }) => {

    const [asistencia, setAsistencia] = useState();
    const [votacion, setVotacion] = useState();
    const [proyectos, setProyectos] = useState();

        useEffect(() => {
        const starCountRef = ref(db, 'senadores/asistencia/' + item);
        onValue(starCountRef, (snapshot) => {
                console.log(snapshot.val(item))
                setAsistencia(snapshot.val(item))
            })
        }, [item])

        useEffect(() => {
            const starCountRef = ref(db, 'senadores/votaciones/' + item);
            onValue(starCountRef, (snapshot) => {
                    console.log(snapshot.val(route.params.id))
                    setVotacion(snapshot.val(item))
                })
        }, [item])

        useEffect(() => {
            const starCountRef = ref(db, 'senadores/proyectos/' + item);
            onValue(starCountRef, (snapshot) => {
                    console.log(snapshot.val(route.params.id))
                    setProyectos(snapshot.val(item))
                })
        }, [item])

    const {senador} = route.params;
    const item = senador.id;

    return (
        <><View style={styles.back}></View>
        <View style={styles.principal}>
            <View style={styles.container1}>
                <Image style={styles.image} source={senador.foto} />
                <View style={styles.container2}>
                    <Text style={styles.title}>{senador.nombre}</Text>
                    <Text style={styles.partido}>{senador.partido}</Text>
                    <View style={styles.containerInfo}>
                            <View style={styles.estadistica}>
                                <FontAwesome name="check-circle-o" size={22} color="green" />
                                <Entypo name="circle-with-cross" size={22} color="red" />
                                <FontAwesome name="check-circle-o" size={22} color="black" />
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.informacion}>Asistencia {asistencia}</Text>
                                <Text style={styles.informacion}>Votación {votacion}</Text>
                                <Text style={styles.informacion}>Presentación de Proyectos {proyectos}</Text>
                            </View>
                        </View>
                </View>
            </View>
            <Text style={styles.descripcion}>{senador.descripcion}</Text>
        </View>
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
    principal: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%',
        marginLeft: '1.5%',
        width: '97%',
    }, 
    container1: {
        flexDirection: 'row',
        width: '100%',
    },
    image: {
        width: 200,
        height: 280,
    },
    title: {
        fontSize: 35, 
        fontFamily: 'NotoSansMyanmar_700Bold',
        marginRight: 10,
        marginHorizontal: '2%',
        maxWidth: '98%',
    },
    descripcion: {
        fontFamily: 'NotoSansMyanmar_400Regular',
        margin: '1%',
        marginTop: '2%',
        fontSize: 16,
        textAlign: 'justify'
    },
    containerInfo: {
        flexDirection: 'row',
        marginTop: 10,
        margin: 3,
    },
    estadistica: {
        marginTop: 3,
        marginVertical: 4,
    },
    info: {
        marginLeft: 8,
    },
    informacion: {
        fontFamily: 'NotoSansMyanmar_400Regular',
        fontSize: 15,
        color: COLORS.black,
        maxWidth: '98%'
    },
    container2: {
        maxWidth: '98%',
        flex:1,
        marginHorizontal: '2%',
    },
    partido: {
        fontFamily: 'NotoSansMyanmar_700Bold',
        fontSize: 16,
        margin: 4,
        marginHorizontal: 5,
    }
})
