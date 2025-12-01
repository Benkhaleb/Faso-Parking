import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  getHistoryTickets,
  deleteHistoryTicket,
} from "../storage/ticketStorage";
import TicketItem from "../components/TicketItem";
import { formatAmount } from "../utils/calculatePrice";
import { useTheme } from "../context/ThemeContext";

const HistoryScreen = ({ navigation }) => {
  const { colors } = useTheme(); // Ajout du hook useTheme

  // --- ÉTATS ---
  const [historyTickets, setHistoryTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- EFFETS ---
  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadHistory();
    });
    return unsubscribe;
  }, [navigation]);

  // --- FONCTIONS ---
  const loadHistory = async () => {
    setLoading(true);
    try {
      const history = await getHistoryTickets();
      const sortedHistory = history.sort(
        (a, b) => new Date(b.exitTime) - new Date(a.exitTime)
      );
      setHistoryTickets(sortedHistory);
    } catch (error) {
      console.error("Erreur de chargement de l'historique:", error);
      Alert.alert("Erreur", "Impossible de charger l'historique");
    }
    setLoading(false);
  };

  const handleDelete = (ticketId, parkingName) => {
    Alert.alert(
      "🗑️ Supprimer le ticket",
      `Voulez-vous vraiment supprimer le ticket de ${parkingName} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const success = await deleteHistoryTicket(ticketId);
            if (success) {
              Alert.alert("✓ Supprimé", "Le ticket a été supprimé");
              loadHistory();
            } else {
              Alert.alert("Erreur", "Impossible de supprimer le ticket");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    if (historyTickets.length === 0) return;

    Alert.alert(
      "🗑️ Tout supprimer",
      `Voulez-vous vraiment supprimer tous les ${historyTickets.length} tickets de l'historique ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Tout supprimer",
          style: "destructive",
          onPress: async () => {
            let successCount = 0;
            for (const ticket of historyTickets) {
              const success = await deleteHistoryTicket(ticket.id);
              if (success) successCount++;
            }

            if (successCount === historyTickets.length) {
              Alert.alert("✓ Supprimé", "Tous les tickets ont été supprimés");
            } else {
              Alert.alert(
                "Partiellement supprimé",
                `${successCount}/${historyTickets.length} tickets supprimés`
              );
            }
            loadHistory();
          },
        },
      ]
    );
  };

  const getStats = () => {
    const totalAmount = historyTickets.reduce(
      (sum, ticket) => sum + ticket.totalAmount,
      0
    );
    const count = historyTickets.length;
    const avgAmount = count > 0 ? Math.round(totalAmount / count) : 0;
    return { totalAmount, count, avgAmount };
  };

  const stats = getStats();

  // --- RENDU ---
  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Chargement de l'historique...
        </Text>
      </View>
    );
  }

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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.christmasIcon}>🎄</Text>
          <Text style={styles.headerTitle}>Historique</Text>
          <Text style={styles.christmasIcon}>🎄</Text>
        </View>
        {historyTickets.length > 0 && (
          <TouchableOpacity
            style={styles.deleteAllButton}
            onPress={handleDeleteAll}
          >
            <Text style={styles.deleteAllButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}
        {historyTickets.length === 0 && <View style={styles.backButton} />}
      </View>

      {historyTickets.length === 0 ? (
        <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
          <Text style={styles.emptyIcon}>🎁</Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Aucun historique
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Vos tickets clôturés apparaîtront ici
          </Text>
        </View>
      ) : (
        <>
          {/* Section des statistiques */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={styles.statIcon}>🎟️</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stats.count}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Ticket{stats.count > 1 ? "s" : ""}
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatAmount(stats.totalAmount)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total dépensé
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatAmount(stats.avgAmount)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Moyenne
              </Text>
            </View>
          </View>

          {/* Liste des tickets */}
          <FlatList
            data={historyTickets}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.ticketItemContainer}>
                <TicketItem ticket={item} isHistory={true} />
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    { backgroundColor: colors.error },
                  ]}
                  onPress={() => handleDelete(item.id, item.parkingName)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={
              <View
                style={[
                  styles.footerContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text
                  style={[styles.footerText, { color: colors.textSecondary }]}
                >
                  💡 Appuyez sur 🗑️ pour supprimer un ticket
                </Text>
              </View>
            }
          />
        </>
      )}
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
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  christmasIcon: {
    fontSize: 20,
  },
  deleteAllButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteAllButtonText: {
    fontSize: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    padding: 40,
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  ticketItemContainer: {
    marginBottom: 12,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  footerContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default HistoryScreen;
