import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import { Desk } from "../components/desk";
import { InfoPartido } from "../components/infoPartido";

export const CamaraDipu = () => {

    const partidos = 
        {
            id: 0, partido: 'IND',
            id: 1, partido: 'FA',
            id: 2, partido: 'PS',
            id: 3, partido: 'PC',
            id: 4, partido: 'PPD',
            id: 5, partido: 'PL',
            id: 6, partido: 'PR',
            id: 7, partido: 'AH',
            id: 8, partido: 'FRVS',
            id: 9, partido: 'PDC',
            id: 10, partido: 'PEV',
            id: 11, partido: 'UDI',
            id: 12, partido: 'RN',
            id: 13, partido: 'EVOPOLI',
            id: 14, partido: 'PREP',
            id: 15, partido: 'PNL',
            id: 11, partido: 'PSC',
            id: 12, partido: 'PD',
            id: 13, partido: 'AM',
            id: 14, partido: 'PDG',
            id: 15, partido: 'DES',
        }
    

    const diputados = [
        { radio: 95, 
        cantidad: [
            {id: 0, partido: 'IND'},
            {id: 1, partido: 'PC'},
            {id: 2, partido: 'PC'},
            {id: 3, partido: 'PS'},
            {id: 4, partido: 'PS'},
            {id: 5, partido: 'PS'},
            {id: 6, partido: 'FRVS'},
            {id: 7, partido: 'FRVS'},
            {id: 8, partido: 'EVOPOLI'},
            {id: 9, partido: 'EVOPOLI'},
            {id: 10, partido: 'PNL'},
            {id: 11, partido: 'PNL'},
            {id: 12, partido: 'PREP'},
            {id: 13, partido: 'PREP'},
            {id: 14, partido: 'PREP'},
            {id: 15, partido: 'PDG'},
        ], 
        },
        { radio: 120, cantidad: [
            {id: 16, partido: 'PDC'},
            {id: 17, partido: 'PDC'},
            {id: 18, partido: 'PC'},
            {id: 19, partido: 'PC'},
            {id: 20, partido: 'PS'},
            {id: 21, partido: 'PS'},
            {id: 22, partido: 'PS'},
            {id: 23, partido: 'FA'},
            {id: 24, partido: 'FA'},
            {id: 25, partido: 'FA'},
            {id: 26, partido: 'EVOPOLI'},
            {id: 27, partido: 'EVOPOLI'},
            {id: 28, partido: 'PNL'},
            {id: 29, partido: 'PNL'},
            {id: 30, partido: 'PNL'},
            {id: 31, partido: 'PREP'},
            {id: 32, partido: 'PREP'},
            {id: 33, partido: 'PREP'},
            {id: 34, partido: 'PREP'},
            {id: 35, partido: 'PREP'},
        ] 
        },
        { radio: 145, cantidad: [
            {id: 36, partido: 'PDC'},
            {id: 37, partido: 'PDC'},
            {id: 38, partido: 'PC'},
            {id: 39, partido: 'PC'},
            {id: 40, partido: 'PC'},
            {id: 41, partido: 'PS'},
            {id: 42, partido: 'PS'},
            {id: 43, partido: 'PS'},
            {id: 44, partido: 'FA'},
            {id: 45, partido: 'FA'},
            {id: 46, partido: 'FA'},
            {id: 47, partido: 'FA'},
            {id: 48, partido: 'UDI'},
            {id: 49, partido: 'UDI'},
            {id: 50, partido: 'UDI'},
            {id: 51, partido: 'UDI'},
            {id: 52, partido: 'PNL'},
            {id: 53, partido: 'PREP'},
            {id: 54, partido: 'PREP'},
            {id: 55, partido: 'PREP'},
            {id: 56, partido: 'PREP'},
            {id: 57, partido: 'PREP'},
            {id: 58, partido: 'PD'},
            {id: 59, partido: 'PD'},
        ] 
        },
        { radio: 170, cantidad: [
            {id: 60, partido: 'PDC'},
            {id: 61, partido: 'PDC'},
            {id: 62, partido: 'PC'},
            {id: 63, partido: 'PC'},
            {id: 64, partido: 'PC'},
            {id: 65, partido: 'PC'},
            {id: 66, partido: 'PS'},
            {id: 67, partido: 'PS'},
            {id: 68, partido: 'PS'},
            {id: 69, partido: 'FA'},
            {id: 70, partido: 'FA'},
            {id: 71, partido: 'FA'},
            {id: 73, partido: 'FA'},
            {id: 74, partido: 'FA'},
            {id: 75, partido: 'UDI'},
            {id: 76, partido: 'UDI'},
            {id: 77, partido: 'UDI'},
            {id: 78, partido: 'UDI'},
            {id: 79, partido: 'UDI'},
            {id: 80, partido: 'RN'},
            {id: 81, partido: 'RN'},
            {id: 82, partido: 'RN'},
            {id: 83, partido: 'RN'},
            {id: 84, partido: 'RN'},
            {id: 85, partido: 'RN'},
            {id: 86, partido: 'RN'},
            {id: 87, partido: 'PD'},
            {id: 88, partido: 'PD'},
        ] 
        },
        { radio: 195, cantidad: [
            {id: 89, partido: 'PDC'},
            {id: 90, partido: 'PDC'},
            {id: 91, partido: 'PPD'},
            {id: 92, partido: 'PPD'},
            {id: 93, partido: 'PPD'},
            {id: 94, partido: 'PPD'},
            {id: 95, partido: 'PL'},
            {id: 96, partido: 'PL'},
            {id: 97, partido: 'PL'},
            {id: 98, partido: 'PR'},
            {id: 99, partido: 'PR'},
            {id: 100, partido: 'FA'},
            {id: 101, partido: 'FA'},
            {id: 102, partido: 'FA'},
            {id: 103, partido: 'FA'},
            {id: 104, partido: 'FA'},
            {id: 105, partido: 'UDI'},
            {id: 106, partido: 'UDI'},
            {id: 107, partido: 'UDI'},
            {id: 108, partido: 'UDI'},
            {id: 109, partido: 'UDI'},
            {id: 110, partido: 'PSC'},
            {id: 111, partido: 'PSC'},
            {id: 112, partido: 'RN'},
            {id: 113, partido: 'RN'},
            {id: 114, partido: 'RN'},
            {id: 115, partido: 'RN'},
            {id: 116, partido: 'RN'},
            {id: 117, partido: 'RN'},
            {id: 118, partido: 'RN'},
            {id: 119, partido: 'RN'},
            {id: 120, partido: 'PD'},
        ] 
        },
        { radio: 220, cantidad: [
            {id: 121, partido: 'PEV'},
            {id: 123, partido: 'PDC'},
            {id: 124, partido: 'PPD'},
            {id: 125, partido: 'PPD'},
            {id: 126, partido: 'PPD'},
            {id: 127, partido: 'PPD'},
            {id: 128, partido: 'PPD'},
            {id: 129, partido: 'PL'},
            {id: 130, partido: 'PL'},
            {id: 131, partido: 'PR'},
            {id: 132, partido: 'PR'},
            {id: 133, partido: 'PR'},
            {id: 134, partido: 'FA'},
            {id: 135, partido: 'FA'},
            {id: 136, partido: 'FA'},
            {id: 137, partido: 'AH'},
            {id: 138, partido: 'AH'},
            {id: 139, partido: 'UDI'},
            {id: 140, partido: 'UDI'},
            {id: 141, partido: 'UDI'},
            {id: 142, partido: 'UDI'},
            {id: 143, partido: 'UDI'},
            {id: 144, partido: 'UDI'},
            {id: 145, partido: 'PSC'},
            {id: 146, partido: 'PSC'},
            {id: 147, partido: 'PSC'},
            {id: 148, partido: 'RN'},
            {id: 149, partido: 'RN'},
            {id: 150, partido: 'RN'},
            {id: 151, partido: 'RN'},
            {id: 152, partido: 'RN'},
            {id: 153, partido: 'DES'},
            {id: 154, partido: 'DES'},
            {id: 155, partido: 'DES'},
            {id: 156, partido: 'AM'},
        ] 
        },
    ];

    const pelotas = [];
    const infoPartidos = [];
    const partidosCoordenadas = [];

    {
        diputados.map( (fila, index) => {
            for (let i = 0; i < fila.cantidad.length; i++) {
                //calcular angulo de cada pelota
                const anguloEnRadianes = Math.PI * 1.205 * ( i / (fila.cantidad.length - 1)) + 1.25;

                const cartX = fila.radio * Math.cos(anguloEnRadianes);
                const cartY = fila.radio * Math.sin(anguloEnRadianes);

                const posicionX = 250 + cartX - 10;
                const posicionY = 250 - cartY -10;

                const partido = fila.cantidad[i].partido;

                const dataPartido = {
                    nombre: partido,
                    coordenadas: [posicionX, posicionY]
                }

                partidosCoordenadas.push(dataPartido);

                const pelota = (
                    <Desk 
                        partido={partido}
                        left = {posicionX}
                        top = {posicionY}  
                        key={fila.cantidad[i].id}
                    />
                )
                pelotas.push(pelota);
                
            }
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

    console.log('info partidos agrupados:')
    console.log(promediosPartidos);

    for (const partido in promediosPartidos){

        const [posicionX, posicionY] = promediosPartidos[partido];
        const id = `${partido}-${posicionX}-${posicionY}`;

        const infoPartido= (
            <InfoPartido 
                partido={partido}
                porcentaje={"60%"}
                left = {posicionX-18}
                top = {posicionY-18}  
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
        width: 20,
        height: 20,
        borderRadius: 40,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camara: {
        width: '80%',
        height: '80%',
        position: 'absolute',
    }
})