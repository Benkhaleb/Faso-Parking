import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isDarkMode ? "sunny" : "moon"}
        size={24}
        color={colors.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
