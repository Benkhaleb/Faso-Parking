// SplashScreen.js
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const carAnim = useRef(new Animated.Value(-100)).current;
  const textAnim = useRef(new Animated.Value(50)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animations Noël
  const snowflakes = useRef(
    [...Array(20)].map(() => ({
      translateY: new Animated.Value(-50),
      translateX: new Animated.Value(Math.random() * width),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
    }))
  ).current;

  const hatAnim = useRef(new Animated.Value(-30)).current;
  const lightAnim = useRef(new Animated.Value(0)).current;
  const starsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Flocons de neige améliorés
    snowflakes.forEach((snowflake, index) => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.delay(index * 150),
            Animated.timing(snowflake.opacity, {
              toValue: 0.8,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(index * 150),
            Animated.timing(snowflake.translateY, {
              toValue: height,
              duration: 5000 + Math.random() * 3000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });

    // Guirlandes lumineuses clignotantes
    Animated.loop(
      Animated.sequence([
        Animated.timing(lightAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(lightAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation des étoiles
    Animated.loop(
      Animated.sequence([
        Animated.timing(starsAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(starsAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation principale améliorée
    Animated.sequence([
      // Apparition du cercle
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      // Descente de la voiture et du bonnet
      Animated.parallel([
        Animated.spring(carAnim, {
          toValue: 0,
          tension: 35,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(hatAnim, {
          toValue: 0,
          tension: 30,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      // Apparition du texte
      Animated.parallel([
        Animated.timing(textAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1200),
      // Disparition
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onFinish) onFinish();
    });

    // Animation barre de chargement
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Arrière-plan dégradé simulé */}
      <View style={styles.gradientOverlay} />

      {/* Flocons de neige */}
      {snowflakes.map((snowflake, index) => (
        <Animated.View
          key={index}
          style={[
            styles.snowflake,
            {
              opacity: snowflake.opacity,
              transform: [
                { translateX: snowflake.translateX },
                { translateY: snowflake.translateY },
                { scale: snowflake.scale },
              ],
            },
          ]}
        >
          <Text style={styles.snowflakeText}>❄</Text>
        </Animated.View>
      ))}

      {/* Guirlandes lumineuses en haut */}
      <View style={styles.lightsContainer}>
        {[...Array(10)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.light,
              {
                backgroundColor:
                  index % 4 === 0
                    ? "#ff4444"
                    : index % 4 === 1
                    ? "#44ff44"
                    : index % 4 === 2
                    ? "#ffeb3b"
                    : "#4444ff",
                opacity: lightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: index % 2 === 0 ? [0.4, 1] : [1, 0.4],
                }),
                transform: [
                  {
                    scale: lightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: index % 2 === 0 ? [0.9, 1.1] : [1.1, 0.9],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Contenu principal */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.circle}>
          {/* Bonnet de Noël */}
          <Animated.View
            style={[styles.santaHat, { transform: [{ translateY: hatAnim }] }]}
          >
            <View style={styles.hatTop} />
            <View style={styles.hatBrim} />
            <View style={styles.hatPom} />
          </Animated.View>

          {/* Voiture de parking */}
          <Animated.View
            style={[
              styles.carContainer,
              { transform: [{ translateY: carAnim }] },
            ]}
          >
            <View style={styles.carBody}>
              <View style={styles.carTop} />
              <View style={styles.carBottom}>
                <View style={styles.headlight} />
                <View style={styles.grille} />
                <View style={styles.headlight} />
              </View>
            </View>
            <View style={styles.wheels}>
              <View style={styles.wheel}>
                <View style={styles.wheelCenter} />
              </View>
              <View style={styles.wheel}>
                <View style={styles.wheelCenter} />
              </View>
            </View>
            {/* Badge P avec décoration */}
            <View style={styles.pLetter}>
              <Text style={styles.pText}>P</Text>
              <View style={styles.hollyContainer}>
                <Text style={styles.holly}>🎄</Text>
              </View>
            </View>
          </Animated.View>

          {/* Étoiles scintillantes */}
          <Animated.Text
            style={[
              styles.star,
              styles.starLeft,
              {
                opacity: starsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
                transform: [
                  {
                    scale: starsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          >
            ⭐
          </Animated.Text>
          <Animated.Text
            style={[
              styles.star,
              styles.starRight,
              {
                opacity: starsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.5],
                }),
                transform: [
                  {
                    scale: starsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.2, 0.8],
                    }),
                  },
                ],
              },
            ]}
          >
            ⭐
          </Animated.Text>
        </View>

        {/* Textes */}
        <Animated.View
          style={[
            styles.textContainer,
            { opacity: textOpacity, transform: [{ translateY: textAnim }] },
          ]}
        >
          <Text style={styles.title}>FASOPARKING</Text>
          <Text style={styles.subtitle}>🎅 Joyeux Noël ! 🎄</Text>
          <Text style={styles.subtext}>Trouvez votre place facilement</Text>
        </Animated.View>
      </Animated.View>

      {/* Barre de chargement stylisée */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>

      {/* Décorations du bas */}
      <View style={styles.bottomDecoration}>
        <Text style={styles.decoIcon}>🎁</Text>
        <Text style={styles.decoIcon}>🎄</Text>
        <Text style={styles.decoIcon}>⛄</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d3d5c",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(26, 77, 122, 0.6)",
  },
  content: {
    alignItems: "center",
    zIndex: 10,
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
    marginBottom: 50,
    borderWidth: 5,
    borderColor: "#c41e3a",
  },
  carContainer: {
    width: 120,
    height: 80,
    position: "relative",
  },
  carBody: {
    width: "100%",
    height: 60,
  },
  carTop: {
    width: "60%",
    height: 28,
    backgroundColor: "#0066cc",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginLeft: "20%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  carBottom: {
    width: "100%",
    height: 38,
    backgroundColor: "#0066cc",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headlight: {
    width: 14,
    height: 10,
    backgroundColor: "#ffeb3b",
    borderRadius: 5,
    shadowColor: "#ffeb3b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  grille: {
    width: 42,
    height: 7,
    backgroundColor: "#004999",
    borderRadius: 3,
  },
  wheels: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: -6,
    width: "90%",
    paddingHorizontal: 8,
  },
  wheel: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#222",
    borderWidth: 3,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
  },
  wheelCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#888",
  },
  pLetter: {
    position: "absolute",
    right: -18,
    top: 8,
    width: 40,
    height: 40,
    backgroundColor: "#0066cc",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  hollyContainer: {
    position: "absolute",
    top: -10,
    right: -6,
  },
  holly: {
    fontSize: 14,
  },
  santaHat: {
    position: "absolute",
    top: -35,
    left: 50,
    zIndex: 10,
    alignItems: "center",
  },
  hatTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 22,
    borderRightWidth: 22,
    borderBottomWidth: 35,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#c41e3a",
  },
  hatBrim: {
    width: 55,
    height: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: -3,
  },
  hatPom: {
    width: 14,
    height: 14,
    backgroundColor: "white",
    borderRadius: 7,
    position: "absolute",
    top: -10,
  },
  star: {
    fontSize: 24,
    position: "absolute",
  },
  starLeft: {
    top: 15,
    left: 8,
  },
  starRight: {
    bottom: 15,
    right: 8,
  },
  lightsContainer: {
    position: "absolute",
    top: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    width: width * 0.85,
    zIndex: 5,
  },
  light: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  snowflake: {
    position: "absolute",
    top: 0,
  },
  snowflakeText: {
    fontSize: 22,
    color: "white",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 3,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 20,
    color: "#ffeb3b",
    marginTop: 10,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.95)",
    marginTop: 6,
    fontStyle: "italic",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    width: width * 0.65,
    alignItems: "center",
    zIndex: 10,
  },
  loadingBar: {
    height: 5,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 3,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: "#ffeb3b",
    borderRadius: 3,
    shadowColor: "#ffeb3b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    marginTop: 8,
    fontStyle: "italic",
  },
  bottomDecoration: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width: width * 0.4,
    zIndex: 5,
  },
  decoIcon: {
    fontSize: 24,
    opacity: 0.7,
  },
});

export default SplashScreen;
