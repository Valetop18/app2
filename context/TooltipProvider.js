import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const TooltipContext = createContext();

export const TooltipProvider = ({ children }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const openTooltip = (id) => {
    setActiveTooltip((current) =>
      current === id ? null : id
    );
  };

  const closeTooltip = () => {
    setActiveTooltip(null);
  };

  const value = useMemo(
    () => ({
      activeTooltip,
      openTooltip,
      closeTooltip,
    }),
    [activeTooltip]
  );

  return (
    <TooltipContext.Provider value={value}>
      <View style={styles.container}>
        {children}

        {activeTooltip && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeTooltip}
          />
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
});