import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "../constants/colors";

const TooltipContext = createContext();

export const TooltipProvider = ({ children }) => {
  const providerRef = useRef(null);

  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);

  const openTooltip = (id, data) => {
    if (activeTooltip === id) {
      setActiveTooltip(null);
      setTooltipData(null);
      return;
    }

    setTooltipData(data);
    setActiveTooltip(id);
  };

  const closeTooltip = () => {
    setActiveTooltip(null);
    setTooltipData(null);
  };

  const value = useMemo(
    () => ({
      activeTooltip,
      openTooltip,
      closeTooltip,
      providerRef,
    }),
    [activeTooltip]
  );

  return (
    <TooltipContext.Provider value={value}>
      <View
        ref={providerRef}
        collapsable={false}
        style={styles.container}
      >
        {children}

        {activeTooltip && tooltipData && (
          <View
            style={styles.tooltipLayer}
            pointerEvents="box-none"
          >
            <Pressable
              style={styles.closeArea}
              onPress={closeTooltip}
            />

            <View
              pointerEvents="none"
              style={[
                styles.tooltip,
                {
                  width: tooltipData.width,
                  left: tooltipData.left,
                  top: tooltipData.top,
                },
                tooltipData.tooltipStyle,
              ]}
            >
              <View
                style={[
                  styles.arrow,
                  {
                    transform: [
                      {
                        translateX:
                          -6 + tooltipData.arrowOffsetX,
                      },
                      { rotate: "45deg" },
                    ],
                  },
                ]}
              />

              {typeof tooltipData.text === "string" ? (
                <Text
                  style={[
                    styles.text,
                    tooltipData.textStyle,
                  ]}
                >
                  {tooltipData.text}
                </Text>
              ) : (
                tooltipData.text
              )}
            </View>
          </View>
        )}
      </View>
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error(
      "useTooltip debe utilizarse dentro de TooltipProvider."
    );
  }

  return context;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tooltipLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    elevation: 99999,
  },

  closeArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  tooltip: {
    position: "absolute",
    backgroundColor: COLORS.greenM,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    zIndex: 2,
    elevation: 12,
  },

  text: {
    color: COLORS.back,
    fontSize: 13,
    textAlign: "left",
  },

  arrow: {
    position: "absolute",
    top: -5,
    left: "10%",
    width: 12,
    height: 12,
    backgroundColor: COLORS.greenM,
  },
});