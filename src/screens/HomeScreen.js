import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import {
  getActiveTickets,
  getHistoryTickets,
  deleteHistoryTicket,
} from "../storage/ticketStorage";
import TicketItem from "../components/TicketItem";
import { formatAmount } from "../utils/calculatePrice";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

const HomeScreen = ({ navigation }) => {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  // --- ÉTATS ---
  const [activeTickets, setActiveTickets] = useState([]);
  const [historyTickets, setHistoryTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- EFFETS ---
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  // --- FONCTIONS ---
  const loadData = async () => {
    setLoading(true);
    try {
      const [active, history] = await Promise.all([
        getActiveTickets(),
        getHistoryTickets(),
      ]);
      setActiveTickets(active);
      setHistoryTickets(
        history.sort((a, b) => new Date(b.exitTime) - new Date(a.exitTime))
      );
    } catch (error) {
      console.error("Erreur de chargement:", error);
      Alert.alert("Erreur", "Impossible de charger les données");
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDeleteHistoryTicket = (ticketId, parkingName) => {
    Alert.alert(
      "Supprimer le ticket",
      `Voulez-vous supprimer le ticket de ${parkingName} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const success = await deleteHistoryTicket(ticketId);
            if (success) {
              loadData();
            } else {
              Alert.alert("Erreur", "Impossible de supprimer le ticket");
            }
          },
        },
      ]
    );
  };

  // Calculer les statistiques du jour
  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTickets = historyTickets.filter((ticket) => {
      const ticketDate = new Date(ticket.exitTime);
      ticketDate.setHours(0, 0, 0, 0);
      return ticketDate.getTime() === today.getTime();
    });

    const todayTotal = todayTickets.reduce((sum, t) => sum + t.totalAmount, 0);
    const monthTotal = historyTickets
      .filter((t) => {
        const d = new Date(t.exitTime);
        return (
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      })
      .reduce((sum, t) => sum + t.totalAmount, 0);

    return {
      activeCount: activeTickets.length,
      todayCount: todayTickets.length,
      todayTotal,
      monthTotal,
    };
  };

  const stats = getTodayStats();

  // --- RENDU ---
  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Chargement...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* En-tête avec bouton dark mode */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <Text style={styles.location}>📍 Ouagadougou</Text>
          </View>

          {/* Bouton Dark Mode */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDarkMode ? "sunny" : "moon"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu scrollable */}
      <FlatList
        data={[{ type: "content" }]}
        keyExtractor={(item) => item.type}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={() => (
          <View style={styles.content}>
            {/* Dashboard - Vue d'ensemble */}
            <View style={styles.dashboardSection}>
              <Text style={[styles.dashboardTitle, { color: colors.text }]}>
                Vue d'ensemble
              </Text>

              <View style={styles.statsGrid}>
                {/* Carte Tickets Actifs */}
                <View
                  style={[
                    styles.statCard,
                    styles.activeCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View style={styles.statIconContainer}>
                    <Text style={styles.statIcon}>🎫</Text>
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {stats.activeCount}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Ticket{stats.activeCount > 1 ? "s" : ""} actif
                    {stats.activeCount > 1 ? "s" : ""}
                  </Text>
                </View>

                {/* Carte Aujourd'hui */}
                <View
                  style={[
                    styles.statCard,
                    styles.todayCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View style={styles.statIconContainer}>
                    <Text style={styles.statIcon}>📅</Text>
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {stats.todayCount}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Aujourd'hui
                  </Text>
                </View>

                {/* Carte Dépenses du jour */}
                <View
                  style={[
                    styles.statCard,
                    styles.expenseCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View style={styles.statIconContainer}>
                    <Text style={styles.statIcon}>💰</Text>
                  </View>
                  <Text style={[styles.statValueSmall, { color: colors.text }]}>
                    {formatAmount(stats.todayTotal)}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Dépensé aujourd'hui
                  </Text>
                </View>

                {/* Carte Mois */}
                <View
                  style={[
                    styles.statCard,
                    styles.monthCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View style={styles.statIconContainer}>
                    <Text style={styles.statIcon}>📊</Text>
                  </View>
                  <Text style={[styles.statValueSmall, { color: colors.text }]}>
                    {formatAmount(stats.monthTotal)}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Ce mois
                  </Text>
                </View>
              </View>
            </View>

            {/* Section Tickets Actifs */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Tickets en cours
                </Text>
                {activeTickets.length > 0 && (
                  <View
                    style={[styles.badge, { backgroundColor: colors.primary }]}
                  >
                    <Text style={styles.badgeText}>{activeTickets.length}</Text>
                  </View>
                )}
              </View>

              {activeTickets.length === 0 ? (
                <View
                  style={[
                    styles.emptyState,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text style={styles.emptyIcon}>🅿️</Text>
                  <Text style={[styles.emptyText, { color: colors.text }]}>
                    Aucun ticket actif
                  </Text>
                  <Text
                    style={[
                      styles.emptySubtext,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Créez votre premier ticket de parking
                  </Text>
                </View>
              ) : (
                activeTickets.map((ticket) => (
                  <TicketItem
                    key={ticket.id}
                    ticket={ticket}
                    onPress={() =>
                      navigation.navigate("TicketDetail", {
                        ticketId: ticket.id,
                      })
                    }
                  />
                ))
              )}
            </View>

            {/* Section Historique Récent */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Activité récente
                </Text>
                {historyTickets.length > 0 && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("HistoryTab")}
                  >
                    <Text
                      style={[styles.viewAllLink, { color: colors.primary }]}
                    >
                      Tout voir →
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {historyTickets.length === 0 ? (
                <View
                  style={[
                    styles.emptyState,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text style={styles.emptyIcon}>📋</Text>
                  <Text style={[styles.emptyText, { color: colors.text }]}>
                    Pas d'historique
                  </Text>
                  <Text
                    style={[
                      styles.emptySubtext,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Vos tickets terminés apparaîtront ici
                  </Text>
                </View>
              ) : (
                <>
                  {historyTickets.slice(0, 3).map((ticket) => (
                    <TouchableOpacity
                      key={ticket.id}
                      onLongPress={() =>
                        handleDeleteHistoryTicket(ticket.id, ticket.parkingName)
                      }
                      activeOpacity={0.7}
                    >
                      <TicketItem ticket={ticket} isHistory={true} />
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>

            {/* Espace pour le bouton flottant */}
            <View style={styles.bottomSpacer} />
          </View>
        )}
      />
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
  loadingContent: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  themeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  dashboardSection: {
    padding: 20,
    paddingTop: 24,
  },
  dashboardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 32,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statValueSmall: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  bottomSpacer: {
    height: 100,
  },
});

export default HomeScreen;
