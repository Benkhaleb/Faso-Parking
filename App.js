import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AppStack from "./src/navigation/AppStack";
import SplashScreen from "./SplashScreen";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { isDarkMode, colors } = useTheme();

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: isDarkMode,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.primary,
        },
      }}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <AppStack />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
