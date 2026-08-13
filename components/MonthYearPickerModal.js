import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
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

const ITEM_HEIGHT = responsiveHeightScale(44);
const VISIBLE_ITEMS = 5;
const SELECTOR_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const SELECTED_OFFSET = ITEM_HEIGHT * 2;

const MonthYearPickerModal = ({
  visible,
  month,
  year,
  onAccept,
  onClose,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  const monthListRef = useRef(null);
  const yearListRef = useRef(null);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: 120 },
      (_, index) => currentYear - index,
    );
  }, []);

  useEffect(() => {
    if (!visible) return;

    setSelectedMonth(month);
    setSelectedYear(year);

    const monthIndex = MESES.findIndex(
      (item) => item.value === month,
    );

    const yearIndex = years.indexOf(year);

    requestAnimationFrame(() => {
      if (monthIndex >= 0) {
        monthListRef.current?.scrollToOffset({
          offset: monthIndex * ITEM_HEIGHT,
          animated: false,
        });
      }

      if (yearIndex >= 0) {
        yearListRef.current?.scrollToOffset({
          offset: yearIndex * ITEM_HEIGHT,
          animated: false,
        });
      }
    });
  }, [visible, month, year, years]);

  if (!visible) {
    return null;
  }

  const limitarIndice = (index, length) => {
    return Math.max(0, Math.min(index, length - 1));
  };

  const obtenerIndiceFinal = (offset, length) => {
    const index = Math.round(offset / ITEM_HEIGHT);
    return limitarIndice(index, length);
  };

  const finalizarScrollMes = (event) => {
    const offset = event.nativeEvent.contentOffset.y;
    const index = obtenerIndiceFinal(offset, MESES.length);
    const nuevoMes = MESES[index];

    setSelectedMonth(nuevoMes.value);

    monthListRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  const finalizarScrollAnio = (event) => {
    const offset = event.nativeEvent.contentOffset.y;
    const index = obtenerIndiceFinal(offset, years.length);
    const nuevoAnio = years[index];

    setSelectedYear(nuevoAnio);

    yearListRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  const seleccionarMes = (item, index) => {
    setSelectedMonth(item.value);

    monthListRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  const seleccionarAnio = (item, index) => {
    setSelectedYear(item);

    yearListRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  const handleAccept = () => {
    onAccept(selectedMonth, selectedYear);
  };

  const renderMonth = ({ item, index }) => {
    const selected = item.value === selectedMonth;

    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => seleccionarMes(item, index)}
      >
        <Text
          style={[
            styles.itemText,
            selected && styles.itemTextSelected,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderYear = ({ item, index }) => {
    const selected = item === selectedYear;

    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => seleccionarAnio(item, index)}
      >
        <Text
          style={[
            styles.itemText,
            selected && styles.itemTextSelected,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Selecciona mes y año</Text>

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

        <View style={styles.columnTitles}>
          <Text style={styles.columnTitle}>MES</Text>
          <Text style={styles.columnTitle}>AÑO</Text>
        </View>

        <View style={styles.selector}>
          <View style={styles.selectedRow} pointerEvents="none" />

          <View style={styles.column}>
            <FlatList
              ref={monthListRef}
              data={MESES}
              keyExtractor={(item) => String(item.value)}
              renderItem={renderMonth}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              bounces={false}
              contentContainerStyle={{
                paddingVertical: SELECTED_OFFSET,
              }}
              onMomentumScrollEnd={finalizarScrollMes}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
            />
          </View>

          <View style={styles.columnDivider} />

          <View style={styles.column}>
            <FlatList
              ref={yearListRef}
              data={years}
              keyExtractor={(item) => String(item)}
              renderItem={renderYear}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              bounces={false}
              contentContainerStyle={{
                paddingVertical: SELECTED_OFFSET,
              }}
              onMomentumScrollEnd={finalizarScrollAnio}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
            />
          </View>
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
  );
};

export default MonthYearPickerModal;

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    paddingHorizontal: responsiveWidthScale(24),
    zIndex: 100,
    elevation: 100,
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

  columnTitles: {
    flexDirection: "row",
    marginBottom: responsiveHeightScale(7),
  },

  columnTitle: {
    flex: 1,
    textAlign: "center",
    color: COLORS.greenM,
    fontSize: Math.max(11, responsiveWidthScale(13)),
    fontFamily: FONTS.bold,
    letterSpacing: responsiveWidthScale(0.7),
  },

  selector: {
    height: SELECTOR_HEIGHT,
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
    borderRadius: responsiveWidthScale(12),
    backgroundColor: COLORS.back,
  },

  column: {
    flex: 1,
    zIndex: 2,
  },

  columnDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.grey,
    marginVertical: responsiveHeightScale(12),
  },

  selectedRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: SELECTED_OFFSET,
    height: ITEM_HEIGHT,
    backgroundColor: COLORS.verdeclaro,
    borderRadius: responsiveWidthScale(10),
    zIndex: 1,
  },

  item: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: responsiveWidthScale(4),
  },

  itemText: {
    color: COLORS.grey,
    fontSize: Math.max(11, responsiveWidthScale(14)),
    fontFamily: FONTS.regular,
  },

  itemTextSelected: {
    color: COLORS.greenM,
    fontSize: Math.max(11, responsiveWidthScale(15)),
    fontFamily: FONTS.bold,
  },

  acceptButton: {
    width: "100%",
    height: responsiveHeightScale(44),
    backgroundColor: COLORS.greenM,
    borderRadius: responsiveWidthScale(12),
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveHeightScale(18),
  },

  acceptButtonText: {
    color: COLORS.back,
    fontSize: Math.max(11, responsiveWidthScale(15)),
    fontFamily: FONTS.bold,
    letterSpacing: responsiveWidthScale(1),
  },
});