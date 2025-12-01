import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { addTicket } from "../storage/ticketStorage";
import { getCurrentDateTime } from "../utils/calculatePrice";
import { useTheme } from "../context/ThemeContext";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const NewTicketScreen = ({ navigation }) => {
  const { colors } = useTheme(); // Ajout du hook useTheme

  // --- ÉTATS DU FORMULAIRE ---
  const [parkingName, setParkingName] = useState("");
  const [pricePerHour, setPricePerHour] = useState("50");
  const [entryTime, setEntryTime] = useState(getCurrentDateTime());
  const [useCurrentTime, setUseCurrentTime] = useState(true);

  // --- ÉTATS POUR LE QR CODE ---
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (showScanner && !permission?.granted) {
      requestPermission();
    }
  }, [showScanner]);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const qrData = JSON.parse(data);
      if (qrData.parkingName && qrData.pricePerHour) {
        setParkingName(qrData.parkingName);
        setPricePerHour(qrData.pricePerHour.toString());
        setShowScanner(false);
        setScanned(false);

        Alert.alert(
          "🎄 QR Code scanné ✓",
          `Parking: ${qrData.parkingName}\nTarif: ${qrData.pricePerHour} FCFA/h`,
          [{ text: "OK" }]
        );
      } else {
        throw new Error("Données incomplètes");
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "QR Code invalide. Veuillez scanner un QR Code de parking valide.",
        [
          { text: "Réessayer", onPress: () => setScanned(false) },
          {
            text: "Annuler",
            onPress: () => {
              setShowScanner(false);
              setScanned(false);
            },
          },
        ]
      );
    }
  };

  const openScanner = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permission refusée",
          "L'accès à la caméra est nécessaire pour scanner les QR Codes"
        );
        return;
      }
    }
    setShowScanner(true);
    setScanned(false);
  };

  const handleSave = async () => {
    if (!parkingName.trim()) {
      Alert.alert("Erreur", "Veuillez entrer le nom du parking");
      return;
    }

    const price = parseInt(pricePerHour);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Erreur", "Le tarif doit être un nombre positif");
      return;
    }

    const newTicket = {
      id: uuidv4(),
      parkingName: parkingName.trim(),
      entryTime: useCurrentTime ? getCurrentDateTime() : entryTime,
      pricePerHour: price,
      status: "active",
      exitTime: null,
      totalAmount: null,
    };

    const success = await addTicket(newTicket);

    if (success) {
      Alert.alert("🎁 Ticket créé", "Le ticket a été créé avec succès", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Erreur", "Impossible de créer le ticket");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          <Text style={styles.headerTitle}>Nouveau Ticket</Text>
          <Text style={styles.christmasIcon}>🎄</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Bouton Scanner QR Code */}
        <View style={styles.formGroup}>
          <TouchableOpacity
            style={[styles.qrButton, { backgroundColor: colors.primary }]}
            onPress={openScanner}
          >
            <Text style={styles.qrButtonIcon}>📷</Text>
            <Text style={styles.qrButtonText}>Scanner le QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Nom du parking */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            🎅 Nom du parking
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Ex: Marché de Dassasgo"
            placeholderTextColor={colors.textSecondary}
            value={parkingName}
            onChangeText={setParkingName}
          />
        </View>

        {/* Tarif horaire */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            💰 Tarif horaire (FCFA)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="50"
            placeholderTextColor={colors.textSecondary}
            value={pricePerHour}
            onChangeText={setPricePerHour}
            keyboardType="numeric"
          />
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Tarif habituel: 50 FCFA/heure
          </Text>
        </View>

        {/* Heure d'entrée */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            ⏰ Heure d'entrée
          </Text>

          <View style={styles.timeOptions}>
            <TouchableOpacity
              style={[
                styles.timeOption,
                {
                  backgroundColor: useCurrentTime
                    ? colors.primary
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setUseCurrentTime(true)}
            >
              <Text
                style={[
                  styles.timeOptionText,
                  { color: useCurrentTime ? "#FFFFFF" : colors.text },
                ]}
              >
                Maintenant
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.timeOption,
                {
                  backgroundColor: !useCurrentTime
                    ? colors.primary
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setUseCurrentTime(false)}
            >
              <Text
                style={[
                  styles.timeOptionText,
                  { color: !useCurrentTime ? "#FFFFFF" : colors.text },
                ]}
              >
                Personnalisée
              </Text>
            </TouchableOpacity>
          </View>

          {useCurrentTime && (
            <View
              style={[
                styles.currentTimeDisplay,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.currentTimeText, { color: colors.text }]}>
                ⏰ Heure actuelle
              </Text>
            </View>
          )}

          {!useCurrentTime && (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={entryTime}
              onChangeText={setEntryTime}
              placeholder="2025-11-29T14:20"
              placeholderTextColor={colors.textSecondary}
            />
          )}
        </View>

        {/* Info box */}
        <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
          <Text style={styles.infoIcon}>🎁</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Le montant sera calculé automatiquement en fonction de la durée de
            stationnement
          </Text>
        </View>

        {/* Boutons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Annuler
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>🎄 Créer le ticket</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL SCANNER QR CODE */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => {
          setShowScanner(false);
          setScanned(false);
        }}
      >
        <View
          style={[
            styles.scannerContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[styles.scannerHeader, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.scannerTitle, { color: colors.text }]}>
              🎄 Scanner le QR Code
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowScanner(false);
                setScanned(false);
              }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {permission?.granted ? (
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            >
              <View style={styles.scannerOverlay}>
                <View style={styles.scannerFrame} />
                <Text style={styles.scannerInstruction}>
                  🎅 Positionnez le QR Code dans le cadre
                </Text>
              </View>
            </CameraView>
          ) : (
            <View style={styles.permissionContainer}>
              <Text
                style={[styles.permissionText, { color: colors.textSecondary }]}
              >
                Permission caméra requise
              </Text>
              <TouchableOpacity
                style={[
                  styles.permissionButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={requestPermission}
              >
                <Text style={styles.permissionButtonText}>
                  Autoriser la caméra
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginTop: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  hint: {
    fontSize: 13,
    marginTop: 6,
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 12,
    gap: 12,
  },
  qrButtonIcon: {
    fontSize: 24,
  },
  qrButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  timeOptions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  timeOption: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  timeOptionText: {
    fontSize: 15,
    fontWeight: "600",
  },
  currentTimeDisplay: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  currentTimeText: {
    fontSize: 15,
    fontWeight: "500",
  },
  infoBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
    paddingBottom: 60,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scannerContainer: {
    flex: 1,
  },
  scannerHeader: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scannerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: "300",
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 20,
  },
  scannerInstruction: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 30,
    textAlign: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  permissionButton: {
    padding: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NewTicketScreen;
