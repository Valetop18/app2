import React, { useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/fonts';
import { responsiveWidthScale } from "../utils/responsive";

const Input = (props) => {
    const { id, value, setInput } = props;

    const onHandleChangeText = (text,id) => {
        console.log('text changed: ', text);
        // setInput({
        //     ...input,
        //     [id]:text
        // })
        setInput(text);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <TextInput
                { ...props }
                style={styles.input}
                onChangeText={text => onHandleChangeText(text, id)}
                value={value}
                cursorColor={COLORS.black}
            />
            
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: "100%",
    color: COLORS.black,
    fontFamily: FONTS.medium,
    fontSize: Math.max(11, responsiveWidthScale(16)),
    marginLeft: "2%",
    paddingVertical: 0,
    paddingBottom: 0,
    paddingTop: 0,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
});