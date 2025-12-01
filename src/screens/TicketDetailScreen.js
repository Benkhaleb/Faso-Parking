import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getTicketById, closeTicket } from "../storage/ticketStorage";
import {
  formatTime,
  formatDuration,
  calculateDuration,
  calculatePrice,
  getCurrentDateTime,
} from "../utils/calculatePrice";
import { useTheme } from "../context/ThemeContext";

const TicketDetailScreen = ({ route, navigation }) => {
  const { colors } = useTheme(); // Ajout du hook useTheme

  // --- ÉTATS ---
  const { ticketId } = route.params;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(getCurrentDateTime());

  // --- EFFETS ---
  useEffect(() => {
    loadTicket();
  }, []);

  // Minuteur qui se déclenche toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- FONCTIONS ---
  const loadTicket = async () => {
    setLoading(true);
    try {
      const loadedTicket = await getTicketById(ticketId);
      if (loadedTicket) {
        setTicket(loadedTicket);
      } else {
        Alert.alert("Erreur", "Ticket introuvable", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Erreur de chargement:", error);
      Alert.alert("Erreur", "Impossible de charger le ticket");
    }
    setLoading(false);
  };

  const handleCloseTicket = () => {
    if (!ticket) return;

    const exitTime = getCurrentDateTime();
    const totalAmount = calculatePrice(
      ticket.entryTime,
      exitTime,
      ticket.pricePerHour
    );

    Alert.alert(
      "Clôturer le ticket",
      `Montant à payer : ${totalAmount} FCFA\n\nConfirmer la clôture ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Clôturer",
          style: "default",
          onPress: async () => {
            const success = await closeTicket(ticketId, exitTime, totalAmount);
            if (success) {
              Alert.alert(
                "Ticket clôturé",
                `Montant total : ${totalAmount} FCFA`,
                [{ text: "OK", onPress: () => navigation.navigate("HomeTab") }]
              );
            } else {
              Alert.alert("Erreur", "Impossible de clôturer le ticket");
            }
          },
        },
      ]
    );
  };

  // --- RENDU ---
  if (loading || !ticket) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Chargement...
        </Text>
      </View>
    );
  }

  // Calculs en temps réel
  const durationMinutes = calculateDuration(ticket.entryTime, currentTime);
  const currentAmount = calculatePrice(
    ticket.entryTime,
    currentTime,
    ticket.pricePerHour
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* En-tête */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du Ticket</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        {/* Nom du parking */}
        <View style={[styles.parkingCard, { backgroundColor: colors.card }]}>
          <Text style={styles.parkingIcon}>🅿️</Text>
          <Text style={[styles.parkingName, { color: colors.text }]}>
            {ticket.parkingName}
          </Text>
        </View>

        {/* Durée écoulée */}
        <View
          style={[styles.durationCard, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.durationLabel}>Durée de stationnement</Text>
          <Text style={styles.durationValue}>
            {formatDuration(durationMinutes)}
          </Text>
          <Text style={styles.durationSubtext}>Mise à jour en temps réel</Text>
        </View>

        {/* Informations détaillées */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Heure d'entrée
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatTime(ticket.entryTime)}
            </Text>
          </View>

          <View
            style={[styles.infoDivider, { backgroundColor: colors.border }]}
          />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Heure actuelle
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatTime(currentTime)}
            </Text>
          </View>

          <View
            style={[styles.infoDivider, { backgroundColor: colors.border }]}
          />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Tarif horaire
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {ticket.pricePerHour} FCFA
            </Text>
          </View>
        </View>

        {/* Montant actuel */}
        <View style={[styles.amountCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
            Montant actuel
          </Text>
          <Text style={[styles.amountValue, { color: colors.primary }]}>
            {currentAmount} FCFA
          </Text>
          <Text style={[styles.amountNote, { color: colors.textTertiary }]}>
            * Toute heure commencée est due
          </Text>
        </View>

        {/* Info box */}
        <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
          <Text style={styles.infoBoxIcon}>ℹ️</Text>
          <Text style={[styles.infoBoxText, { color: colors.textSecondary }]}>
            Le chronomètre s'actualise chaque seconde. Le montant final sera
            calculé lors de la clôture.
          </Text>
        </View>

        {/* Bouton de clôture */}
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.error }]}
          onPress={handleCloseTicket}
          activeOpacity={0.8}
        >
          <Text style={styles.closeButtonText}>🔒 Clôturer le ticket</Text>
        </TouchableOpacity>

        {/* Espace en bas */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  parkingCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  parkingIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  parkingName: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  durationCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  durationLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
    fontWeight: "600",
  },
  durationValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  durationSubtext: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoDivider: {
    height: 1,
  },
  amountCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  amountNote: {
    fontSize: 12,
    fontStyle: "italic",
  },
  infoBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoBoxIcon: {
    fontSize: 20,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 40,
  },
});

export default TicketDetailScreen;
