import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animation séquentielle
    Animated.sequence([
      // Animation du logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Animation du texte
      Animated.spring(textSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Attendre 1 seconde puis terminer
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 1000);
    });
  }, []);

  const rotate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Cercles d'arrière-plan animés */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle1,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle2,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.3],
                }),
              },
            ],
          },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { rotate }],
          },
        ]}
      >
        <View style={styles.logo}>
          <View style={styles.carIcon}>
            <View style={styles.carBody} />
            <View style={styles.carWindow} />
            <View style={styles.carWheel1} />
            <View style={styles.carWheel2} />
          </View>
          <Text style={styles.pLetter}>P</Text>
        </View>
      </Animated.View>

      {/* Texte */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        <Text style={styles.title}>FASOPARKING</Text>
        <Text style={styles.subtitle}>Trouvez votre place facilement</Text>
      </Animated.View>

      {/* Indicateur de chargement */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                width: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0066CC",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundCircle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle1: {
    width: width * 1.5,
    height: width * 1.5,
    top: -width * 0.5,
  },
  circle2: {
    width: width * 2,
    height: width * 2,
    bottom: -width * 0.8,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  carIcon: {
    width: 80,
    height: 50,
    position: "relative",
  },
  carBody: {
    width: 80,
    height: 35,
    backgroundColor: "#0066CC",
    borderRadius: 8,
    position: "absolute",
    bottom: 8,
  },
  carWindow: {
    width: 60,
    height: 20,
    backgroundColor: "#004C99",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    top: 0,
    left: 10,
  },
  carWheel1: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#333",
    position: "absolute",
    bottom: 0,
    left: 10,
  },
  carWheel2: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#333",
    position: "absolute",
    bottom: 0,
    right: 10,
  },
  pLetter: {
    position: "absolute",
    right: 30,
    fontSize: 60,
    fontWeight: "bold",
    color: "#0066CC",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 80,
    width: width * 0.6,
  },
  loadingBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 2,
  },
});
