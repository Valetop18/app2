import React from "react";
import GridRepresent from "../components/gridRepresents";
import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { COLORS } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { reaccionesRepository } from "../infrastructure/ReaccionesRepository";
import { legisladoresRepository } from "../infrastructure/legisladoresRepository";
import { useFocusEffect } from "@react-navigation/native";

export const Diputados = ({ route, navigation}) => {

        const { user } = useAuth();

        const distrito = route?.params?.distrito;

        const [diputados, setDiputados] = useState([]);

        const [reacciones, setReacciones] = useState({});

        const handleSelected = (item) => {
            navigation.navigate('Descripcion', {
                idDiputado: item.id,
            })
        }

        useEffect(() => {
          cargarLegisladores();
        }, []);

        const cargarLegisladores = async () => { 
            
            try {
                //se podria agregar un spinner
                const data = await legisladoresRepository.getDiputadosByDistrito(distrito);
                setDiputados(data);
                console.log(data);
            } catch (error) {
                
            } finally {
                //desactivar spinner
            }
            
         }

        const loadReacciones = async () => {
        const data = await reaccionesRepository.getReacciones(user.id, "representante");

            if (data) {
                const mapReacciones = {};
                data.forEach( r => {
                mapReacciones[r.target_id] = r.tipo_reaccion;
                } );
                setReacciones(mapReacciones);
            }
        }

        useFocusEffect(
            useCallback(() => {
                loadReacciones();
            }, [])
        );

        const handleLike = (id, tipoReaccion) => { 

            try {

            const actual = reacciones[id];

            const nueva = actual === tipoReaccion ? "null" : tipoReaccion;

            console.log('intento reaccion')

            const resultado = reaccionesRepository.setReaccion(
            user.id,
            id,
            "representante",
            nueva
            );

            setReacciones( prev => ({
            ...prev,
            [id]: nueva
            }) );            
            } catch (error) {
            console.log(error)
            }
        }
        
        const renderGridItem = ({item}) => {
            const reaccion = reacciones[item.id];

            return <GridRepresent item={item} reaccion={reaccion} onSelected={handleSelected} handleLike={handleLike} />
        }
    
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

