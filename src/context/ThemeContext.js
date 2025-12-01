import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Charger la préférence sauvegardée au démarrage
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
    } catch (error) {
      console.log("Erreur lors du chargement du thème:", error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
    } catch (error) {
      console.log("Erreur lors de la sauvegarde du thème:", error);
    }
  };

  const theme = {
    isDarkMode,
    colors: isDarkMode ? darkColors : lightColors,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// Couleurs style Google Material Design
const lightColors = {
  // Backgrounds
  background: "#FFFFFF",
  surface: "#F8F9FA",
  surfaceVariant: "#E8EAED",

  // Primary (Bleu Google)
  primary: "#1A73E8",
  primaryLight: "#4285F4",
  primaryDark: "#1557B0",

  // Textes
  text: "#202124",
  textSecondary: "#5F6368",
  textTertiary: "#80868B",

  // Autres
  border: "#DADCE0",
  card: "#FFFFFF",
  error: "#D93025",
  success: "#1E8E3E",
  warning: "#F9AB00",

  // Accents
  accent: "#EA4335", // Rouge Google
};

const darkColors = {
  // Backgrounds
  background: "#202124",
  surface: "#292A2D",
  surfaceVariant: "#3C4043",

  // Primary (Bleu Google adapté pour dark)
  primary: "#8AB4F8",
  primaryLight: "#AECBFA",
  primaryDark: "#669DF6",

  // Textes
  text: "#E8EAED",
  textSecondary: "#9AA0A6",
  textTertiary: "#5F6368",

  // Autres
  border: "#5F6368",
  card: "#292A2D",
  error: "#F28B82",
  success: "#81C995",
  warning: "#FDD663",

  // Accents
  accent: "#F28B82", // Rouge Google adapté
};
