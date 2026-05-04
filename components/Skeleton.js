import React, {useRef, useEffect, useState} from "react";
import { View, Animated, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export const Skeleton = ({
    width,
    height,
    borderRadius = 50,
    style = {},
    baseColor = COLORS.skeleton,
    duration = 1200,
    isLoading = true,
    waveColor = "white"
}) => {

    const animatedValue = useRef(new Animated.Value(0)).current;

    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        
        if( !isLoading || containerWidth === 0 ) return;

        let isMounted  = true;

        const animate = () => {
            animatedValue.setValue(0);

            Animated.timing( animatedValue, {
                toValue: 1,
                duration,
                useNativeDriver: true
            }).start( ({finished}) => {
                if (isMounted && finished) animate();
            } )


        }

        animate();

        return () => {
            isMounted = false;
            animatedValue.stopAnimation();
        };

    }, [isLoading, containerWidth, duration]);


    const translateX = animatedValue.interpolate({
        inputRange: [0,1],
        outputRange: [-containerWidth, containerWidth]
    })

    return (
        <View
            onLayout={ (e) => setContainerWidth(e.nativeEvent.layout.width)}
            style={[
                styles.container,
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: baseColor
                },
                style,
            ]}
        >
            {
                isLoading && containerWidth > 0 && (
                    <Animated.View style={[styles.shimmerContenedor, { transform: [{translateX}]}]}  >
                        <View style={[styles.waveColor, {backgroundColor: waveColor}]} />
                    </Animated.View>
                )
            }


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden"
    },
    shimmerContenedor: {
        ...StyleSheet.absoluteFillObject
    },
    waveColor: {
        flex: 1,
        width: "100%",
        opacity: 0.4,
        borderRadius: 20
    }
    
})