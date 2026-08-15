import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet, FlatList
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";

const SelectorRegistro = ({
  value,
  placeholder = "Selecciona una opción",
  title = "Selecciona una opción",
  options = [],
  onChange,
  inputFontFamily = FONTS.regular,
}) => {
  const [visible, setVisible] = useState(false);

  const seleccionarOpcion = (option) => {
    onChange(option.value);
    setVisible(false);
  };

  const opcionSeleccionada = options.find(
    (option) => option.value === value,
  );

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectorTextContainer}>
          <Text
            style={[
              styles.selectorText,
              { fontFamily: inputFontFamily },
              !opcionSeleccionada && styles.placeholderText,
            ]}
            numberOfLines={1}
            maxFontSizeMultiplier={1}
          >
            {opcionSeleccionada?.label || placeholder}
          </Text>
        </View>

        <Ionicons
          name="chevron-down"
          size={responsiveWidthScale(18)}
          color={COLORS.greenM}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={() => setVisible(false)}
          />

          <View style={styles.modalContainer}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.title} maxFontSizeMultiplier={1}>{title}</Text>

              <TouchableOpacity
                onPress={() => setVisible(false)}
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                <Ionicons
                  name="close-circle"
                  size={responsiveWidthScale(22)}
                  color={COLORS.grey}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              <FlatList
                data={options}
                keyExtractor={(item) => String(item.value)}
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item, index }) => {
                  const selected = item.value === value;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        index !== options.length - 1 &&
                        styles.optionSeparator,
                      ]}
                      onPress={() => seleccionarOpcion(item)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextSelected,
                        ]}
                        numberOfLines={1}
                        maxFontSizeMultiplier={1}
                      >
                        {item.label}
                      </Text>

                      <Ionicons
                        name={
                          selected
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        size={responsiveWidthScale(21)}
                        color={
                          selected ? COLORS.greenM : COLORS.grey
                        }
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SelectorRegistro;

const styles = StyleSheet.create({
  selector: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidthScale(12),
  },
  selectorText: {
    color: COLORS.black,
    fontSize: Math.max(11, responsiveWidthScale(15)),
    includeFontPadding: false,
    paddingVertical: 0,
  },
  placeholderText: {
    color: COLORS.grey,
  },
  selectorTextContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    marginRight: responsiveWidthScale(8),
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  overlayTouch: {
    flex: 1,
  },

  modalContainer: {
    backgroundColor: COLORS.back,
    borderTopLeftRadius: responsiveWidthScale(16),
    borderTopRightRadius: responsiveWidthScale(16),
    paddingHorizontal: responsiveWidthScale(22),
    paddingTop: responsiveHeightScale(8),
    paddingBottom: responsiveHeightScale(26),
  },

  handle: {
    width: responsiveWidthScale(38),
    height: responsiveHeightScale(4),
    borderRadius: responsiveWidthScale(4),
    backgroundColor: COLORS.grey,
    alignSelf: "center",
    marginBottom: responsiveHeightScale(12),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: responsiveHeightScale(10),
  },

  title: {
    flex: 1,
    color: COLORS.greenM,
    fontSize: Math.max(11, responsiveWidthScale(17)),
    fontFamily: FONTS.bold,
    marginRight: responsiveWidthScale(10),
  },

  optionsContainer: {
    width: "100%",
    maxHeight: responsiveHeightScale(300),
  },

  option: {
    minHeight: responsiveHeightScale(48),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidthScale(6),
  },

  optionSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.grey,
  },

  optionText: {
    flex: 1,
    color: COLORS.black,
    fontSize: Math.max(11, responsiveWidthScale(15)),
    fontFamily: FONTS.regular,
    marginRight: responsiveWidthScale(10),
  },

  optionTextSelected: {
    color: COLORS.greenM,
    fontFamily: FONTS.bold,
  },
});