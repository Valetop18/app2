import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { COLORS } from "../constants/colors";
import {
  responsiveVerticalSize,
  responsiveSize,
  responsiveSpacing,
  responsiveFont,
  responsiveIcon,
} from "../utils/responsive";

export const MESES = [
  { label: "Enero", value: 1 },
  { label: "Febrero", value: 2 },
  { label: "Marzo", value: 3 },
  { label: "Abril", value: 4 },
  { label: "Mayo", value: 5 },
  { label: "Junio", value: 6 },
  { label: "Julio", value: 7 },
  { label: "Agosto", value: 8 },
  { label: "Septiembre", value: 9 },
  { label: "Octubre", value: 10 },
  { label: "Noviembre", value: 11 },
  { label: "Diciembre", value: 12 },
];

const MonthYearPickerModal = ({ visible, month, year, onAccept, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 120 }, (_, index) => currentYear - index);
  }, []);

  useEffect(() => {
    if (visible) {
      setSelectedMonth(month);
      setSelectedYear(year);
    }
  }, [visible, month, year]);

  const handleAccept = () => {
    onAccept(selectedMonth, selectedYear);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Seleccionar mes y año</Text>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              <Ionicons
                name="close-circle"
                size={responsiveIcon(22)}
                color={COLORS.grey}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Mes</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={setSelectedMonth}
              style={styles.picker}
              mode="dropdown"
            >
              {MESES.map((monthItem) => (
                <Picker.Item
                  key={monthItem.value}
                  label={monthItem.label}
                  value={monthItem.value}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Año</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={setSelectedYear}
              style={styles.picker}
              mode="dropdown"
            >
              {years.map((yearItem) => (
                <Picker.Item
                  key={yearItem}
                  label={String(yearItem)}
                  value={yearItem}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAccept}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptButtonText}>ACEPTAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MonthYearPickerModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.back,
    borderRadius: responsiveSize(18),
    paddingHorizontal: responsiveSpacing(20),
    paddingTop: responsiveVerticalSize(18),
    paddingBottom: responsiveVerticalSize(22),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    paddingHorizontal: responsiveSpacing(24),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: responsiveVerticalSize(18),
  },

  title: {
    color: COLORS.greenM,
    fontSize: responsiveFont(18),
    fontFamily: "NotoSansMyanmar_700Bold",
  },

  label: {
    color: COLORS.greenM,
    fontSize: responsiveFont(14),
    fontFamily: "NotoSansMyanmar_600SemiBold",
    marginBottom: responsiveVerticalSize(5),
  },

  pickerContainer: {
    width: "100%",
    height: responsiveVerticalSize(48),
    backgroundColor: COLORS.verdeclaro,
    borderRadius: responsiveSize(10),
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: responsiveVerticalSize(16),
  },

  picker: {
    width: "100%",
    height: responsiveVerticalSize(52),
    color: COLORS.black,
  },

  acceptButton: {
    width: "100%",
    height: responsiveVerticalSize(44),
    backgroundColor: COLORS.greenM,
    borderRadius: responsiveSize(12),
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveVerticalSize(4),
  },

  acceptButtonText: {
    color: COLORS.back,
    fontSize: responsiveFont(15),
    fontFamily: "NotoSansMyanmar_700Bold",
    letterSpacing: 1,
  },
});
