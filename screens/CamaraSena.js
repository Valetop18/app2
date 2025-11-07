import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DeskSena } from "../components/deskSena";
import { COLORS } from "../constants/colors";
import { InfoPartido } from "../components/infoPartido";

export const CamaraSena = () => {

   const senadores = [
        { radio: 80, 
        cantidad: [
            {id: 0, partido: 'FA'},
            {id: 1, partido: 'PPD'},
            {id: 2, partido: 'PPD'},
            {id: 3, partido: 'IND'},
            {id: 4, partido: 'IND'},
            {id: 5, partido: 'IND'},
            {id: 6, partido: 'EVOPOLI'},
            {id: 7, partido: 'PD'},
            {id: 8, partido: 'PD'},
        ], 
        },
        { radio: 110, cantidad: [
            {id: 9, partido: 'PDC'},
            {id: 10, partido: 'PPD'},
            {id: 11, partido: 'PPD'},
            {id: 12, partido: 'PS'},
            {id: 13, partido: 'PS'},
            {id: 14, partido: 'RN'},
            {id: 15, partido: 'RN'},
            {id: 16, partido: 'EVOPOLI'},
            {id: 17, partido: 'EVOPOLI'},
            {id: 18, partido: 'UDI'},
            {id: 19, partido: 'UDI'},
        ] 
        },
        { radio: 140, cantidad: [
            {id: 20, partido: 'PDC'},
            {id: 21, partido: 'PPD'},
            {id: 22, partido: 'PPD'},
            {id: 23, partido: 'PS'},
            {id: 24, partido: 'PS'},
            {id: 25, partido: 'PS'},
            {id: 26, partido: 'RN'},
            {id: 27, partido: 'RN'},
            {id: 28, partido: 'RN'},
            {id: 29, partido: 'RN'},
            {id: 30, partido: 'UDI'},
            {id: 31, partido: 'UDI'},
            {id: 32, partido: 'UDI'},
            {id: 33, partido: 'UDI'},
        ] 
        },
        { radio: 170, cantidad: [
            {id: 34, partido: 'PDC'},
            {id: 35, partido: 'PC'},
            {id: 36, partido: 'PC'},
            {id: 38, partido: 'PS'},
            {id: 39, partido: 'PS'},
            {id: 40, partido: 'FRVS'},
            {id: 41, partido: 'FRVS'},
            {id: 42, partido: 'RN'},
            {id: 43, partido: 'RN'},
            {id: 44, partido: 'RN'},
            {id: 45, partido: 'RN'},
            {id: 46, partido: 'RN'},
            {id: 47, partido: 'UDI'},
            {id: 48, partido: 'UDI'},
            {id: 49, partido: 'UDI'},
            {id: 50, partido: 'PSC'},
        ] 
        },
    ];

    const pelotas = [];
    const infoPartidos = [];
    const partidosCoordenadas = [];

    

    {
        senadores.map( (fila, index) => {
            for (let i = 0; i < fila.cantidad.length; i++) {
                            //calcular angulo de cada pelota
                            const anguloEnRadianes = Math.PI * 1.205 * ( i / (fila.cantidad.length - 1)) + 1.25;

                            const cartX = fila.radio * Math.cos(anguloEnRadianes);
                            const cartY = fila.radio * Math.sin(anguloEnRadianes);

                            const posicionX = 230 + cartX - 12;
                            const posicionY = 230 - cartY -12;

                            const partido = fila.cantidad[i].partido;

                            const dataPartido = {
                                nombre: partido,
                                coordenadas: [posicionX, posicionY]
                            }

                            partidosCoordenadas.push(dataPartido);


                            const pelota = (
                                <DeskSena 
                                    partido={partido}
                                    left = {posicionX}
                                    top = {posicionY}  
                                    key={fila.cantidad[i].id}
                                />
                            )
                            pelotas.push(pelota);
                            
                        }
                        return pelotas;
                   })
                }
    

    const partidosAgrupados = {};
    partidosCoordenadas.forEach( item => {
        const { nombre, coordenadas} = item;
        if(!partidosAgrupados[nombre]){
            partidosAgrupados[nombre] = [];
        }
        partidosAgrupados[nombre].push(coordenadas);
    })


    const promediosPartidos = {};

    for (const partido in partidosAgrupados){
        const coordenadas = partidosAgrupados[partido];
        if(coordenadas.length > 1){

            //contadores para sumar
            let sumX = 0;
            let sumY = 0;

            coordenadas.forEach( par => {
                //[123, 431]
                sumX += par[0];
                sumY += par[1];
            });

            const promedioX = (sumX / coordenadas.length).toFixed(5);
            const promedioY = (sumY / coordenadas.length).toFixed(5);

            promediosPartidos[partido] = [promedioX, promedioY];

        }else{
            const x = coordenadas[0][0];
            const y = coordenadas[0][1];
            promediosPartidos[partido] = [x, y];

        }
    }

    for (const partido in promediosPartidos){
    
            const [posicionX, posicionY] = promediosPartidos[partido];
            const id = `${partido}-${posicionX}-${posicionY}`;
    
            const infoPartido= (
                <InfoPartido 
                    partido={partido}
                    porcentaje={"60%"}
                    left = {posicionX-15}
                    top = {posicionY-15}  
                    key={id}
                />
            )
            infoPartidos.push(infoPartido);
    
        }
    
     return(
        <View style={styles.container}>
                <View style={styles.camara}>
                    { pelotas }
                    { infoPartidos }
                </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.back
    },
    pelota: {
        width: 25,
        height: 25,
        borderRadius: 40,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camara: {
        width: 350,
        height: 500,
        position: 'relative',
    }
    
})