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

// Définir vos couleurs
const lightColors = {
  background: "#FFFFFF",
  surface: "#F5F5F5",
  primary: "#007AFF",
  text: "#000000",
  textSecondary: "#666666",
  border: "#E0E0E0",
  card: "#FFFFFF",
};

const darkColors = {
  background: "#000000",
  surface: "#1C1C1E",
  primary: "#0A84FF",
  text: "#FFFFFF",
  textSecondary: "#EBEBF5",
  border: "#38383A",
  card: "#1C1C1E",
};
