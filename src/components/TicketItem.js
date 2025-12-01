import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  formatTime,
  formatDuration,
  calculateDuration,
  formatShortDate,
  formatAmount,
} from "../utils/calculatePrice";

/**
 * Composant réutilisable pour afficher un ticket (actif ou historique)
 * @param {object} ticket - L'objet ticket à afficher
 * @param {function} onPress - La fonction à appeler au clic (optionnelle)
 * @param {boolean} isHistory - Indique si c'est un ticket de l'historique
 */
const TicketItem = ({ ticket, onPress, isHistory = false }) => {
  // Calcul de la durée en temps réel pour les tickets actifs
  let durationText = "";
  let durationMinutes = 0;

  if (!isHistory) {
    // Pour les tickets actifs : durée depuis l'entrée jusqu'à maintenant
    const now = new Date().toISOString();
    durationMinutes = calculateDuration(ticket.entryTime, now);
    durationText = formatDuration(durationMinutes);
  } else {
    // Pour l'historique : durée totale entre entrée et sortie
    durationMinutes = calculateDuration(ticket.entryTime, ticket.exitTime);
    durationText = formatDuration(durationMinutes);
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isHistory && styles.historyContainer, // Style différent pour l'historique
      ]}
      onPress={onPress}
      disabled={isHistory} // Les tickets de l'historique ne sont pas cliquables
      activeOpacity={isHistory ? 1 : 0.7}
    >
      {/* En-tête du ticket */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.parkingIcon}>🅿️</Text>
          <View>
            <Text style={styles.parkingName}>{ticket.parkingName}</Text>
            {isHistory && (
              <Text style={styles.date}>
                {formatShortDate(ticket.exitTime)}
              </Text>
            )}
          </View>
        </View>

        {/* Affiche le montant pour l'historique */}
        {isHistory && (
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>
              {formatAmount(ticket.totalAmount)}
            </Text>
          </View>
        )}
      </View>

      {/* Informations de temps */}
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Entrée</Text>
          <Text style={styles.timeValue}>{formatTime(ticket.entryTime)}</Text>
        </View>

        {isHistory && (
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Sortie</Text>
            <Text style={styles.timeValue}>{formatTime(ticket.exitTime)}</Text>
          </View>
        )}

        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Durée</Text>
          <Text style={styles.durationValue}>{durationText}</Text>
        </View>
      </View>

      {/* Tarif et badge "En cours" pour les tickets actifs */}
      <View style={styles.footer}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Tarif</Text>
          <Text style={styles.priceValue}>{ticket.pricePerHour} FCFA/h</Text>
        </View>

        {/* Badge "En cours" seulement pour les tickets actifs */}
        {!isHistory && (
          <View style={styles.statusBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>En cours</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Conteneur principal
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  historyContainer: {
    borderLeftColor: "#666",
    opacity: 0.9,
  },

  // En-tête
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  parkingIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  parkingName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  amountContainer: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  // Informations de temps
  timeContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
  },
  timeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  durationValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 13,
    color: "#666",
    marginRight: 8,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  // Badge "En cours"
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
  },
});

export default TicketItem;
