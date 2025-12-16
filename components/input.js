import React, { useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { COLORS } from '../constants/colors';

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
    input:{
        color: COLORS.black,
        fontFamily: 'NotoSansMyanmar_500Medium',
        fontSize: 16,
        marginLeft: '2%',
        height: '100%',
        paddingVertical: 0,
        paddingBottom: 0,
        paddingTop: 0,
    }
})