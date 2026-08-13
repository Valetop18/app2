import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { responsiveWidthScale } from "../utils/responsive";

const Input = ({
  id,
  value,
  setInput,
  style,
  ...textInputProps
}) => {
  const onHandleChangeText = (text) => {
    setInput(text);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        {...textInputProps}
        value={value}
        onChangeText={onHandleChangeText}
        cursorColor={COLORS.black}
        maxFontSizeMultiplier={1}
        style={[styles.input, style]}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },

  input: {
    width: "100%",
    height: "100%",
    color: COLORS.black,
    fontFamily: FONTS.medium,
    fontSize: Math.max(11, responsiveWidthScale(16)),

    paddingHorizontal: responsiveWidthScale(10),
    paddingVertical: 0,

    textAlignVertical: "center",
    includeFontPadding: false,
  },
});