import React from "react";
import { Platform, Text, View, StyleSheet, Dimensions } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import des écrans
import HomeScreen from "../screens/HomeScreen";
import NewTicketScreen from "../screens/NewTicketScreen";
import TicketDetailScreen from "../screens/TicketDetailScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

// Calcul responsive des tailles
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isLargeDevice = width >= 414;

const responsiveFontSize = (size) => {
  if (isSmallDevice) return size * 0.9;
  if (isMediumDevice) return size;
  return size * 1.1;
};

const responsiveSpacing = (size) => {
  if (isSmallDevice) return size * 0.85;
  if (isMediumDevice) return size;
  return size * 1.15;
};

// Composant pour afficher les icônes emoji dans les onglets
function TabIcon({ icon, focused, color }) {
  return (
    <View style={styles.iconContainer}>
      <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
        <Text
          style={[
            styles.iconText,
            {
              opacity: focused ? 1 : 0.5,
              transform: [{ scale: focused ? 1.1 : 1 }],
            },
          ]}
        >
          {icon}
        </Text>
      </View>
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

// Composant pour les onglets du bas (Home + History)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarItemStyle: styles.tabBarItem,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Accueil",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🅿️" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="NewTicketTab"
        component={NewTicketScreen}
        options={{
          tabBarLabel: "Nouveau",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🆕" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          tabBarLabel: "Historique",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="📋" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Navigation principale avec Stack (pour les modales)
export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom",
        gestureEnabled: true,
        gestureDirection: "vertical",
        fullScreenGestureEnabled: true,
      }}
    >
      {/* Les onglets principaux */}
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{
          animation: "fade",
        }}
      />

      {/* Écrans modaux (qui s'ouvrent par-dessus) */}
      <Stack.Screen
        name="NewTicket"
        component={NewTicketScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          gestureEnabled: true,
          gestureDirection: "vertical",
        }}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetailScreen}
        options={{
          presentation: "card",
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  // Container de l'icône
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: responsiveSpacing(44),
  },

  // Wrapper autour de l'icône pour effet visuel
  iconWrapper: {
    width: responsiveSpacing(50),
    height: responsiveSpacing(32),
    borderRadius: responsiveSpacing(16),
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },

  iconWrapperActive: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },

  // Style du texte emoji
  iconText: {
    fontSize: responsiveFontSize(24),
    textAlign: "center",
    lineHeight: responsiveFontSize(28),
  },

  // Indicateur actif sous l'icône
  activeIndicator: {
    width: responsiveSpacing(4),
    height: responsiveSpacing(4),
    borderRadius: responsiveSpacing(2),
    backgroundColor: "#007AFF",
    marginTop: responsiveSpacing(4),
  },

  // Style de la barre de navigation
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    paddingBottom:
      Platform.OS === "ios" ? responsiveSpacing(20) : responsiveSpacing(8),
    paddingTop: responsiveSpacing(8),
    height:
      Platform.OS === "ios" ? responsiveSpacing(88) : responsiveSpacing(68),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
    borderTopLeftRadius: responsiveSpacing(20),
    borderTopRightRadius: responsiveSpacing(20),
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Style du label
  tabBarLabel: {
    fontSize: responsiveFontSize(11),
    fontWeight: "600",
    marginBottom: Platform.OS === "ios" ? 0 : responsiveSpacing(4),
    marginTop: responsiveSpacing(4),
    letterSpacing: 0.2,
  },

  // Style de l'icône
  tabBarIcon: {
    marginTop: responsiveSpacing(4),
  },

  // Style de chaque item
  tabBarItem: {
    paddingVertical: responsiveSpacing(4),
  },
});
