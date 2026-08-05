import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { COLORS } from "../constants/colors";
import {
  responsiveWidthScale,
  responsiveHeightScale,
} from "../utils/responsive";
import { FONTS } from "../constants/fonts";

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
                size={responsiveWidthScale(22)}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    paddingHorizontal: responsiveWidthScale(24),
  },

  container: {
    backgroundColor: COLORS.back,
    borderRadius: responsiveWidthScale(18),
    paddingHorizontal: responsiveWidthScale(20),
    paddingTop: responsiveHeightScale(18),
    paddingBottom: responsiveHeightScale(22),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: responsiveHeightScale(18),
  },

  title: {
    color: COLORS.greenM,
    fontSize: Math.max(11, responsiveWidthScale(18)),
    fontFamily: FONTS.bold,
  },

  label: {
    color: COLORS.greenM,
    fontSize: Math.max(11, responsiveWidthScale(14)),
    fontFamily: FONTS.medium,
    marginBottom: responsiveHeightScale(5),
  },

  pickerContainer: {
    width: "100%",
    height: responsiveHeightScale(48),
    backgroundColor: COLORS.verdeclaro,
    borderRadius: responsiveWidthScale(10),
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: responsiveHeightScale(16),
  },

  picker: {
    width: "100%",
    height: responsiveHeightScale(52),
    color: COLORS.black,
  },

  acceptButton: {
    width: "100%",
    height: responsiveHeightScale(44),
    backgroundColor: COLORS.greenM,
    borderRadius: responsiveWidthScale(12),
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveHeightScale(4),
  },

  acceptButtonText: {
    color: COLORS.back,
    fontSize: Math.max(11, responsiveWidthScale(15)),
    fontFamily: FONTS.bold,
    letterSpacing: responsiveWidthScale(1),
  },
});