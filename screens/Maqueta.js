import React from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, ScrollView } from 'react-native'

export const Maqueta = () => {
  return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? "padding" : "height"}
      style={{flex: 1}}
    >


    <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
    >


        <Text style={{marginTop: 900}}>safkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasfsafkasfmkasmfkasmfkasf</Text>


        <View style={{width: "100%"}}>

            <TextInput
                placeholder="buscar"
                style={styles.input}
            />

        </View>


    </ScrollView>






    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    input : {
        marginBottom: 200
    },
    scrollContainer:{
        flexGrow: 1,
        padding: 20
    }
});