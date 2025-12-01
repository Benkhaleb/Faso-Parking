/**
 * Calcule la durée en minutes entre deux dates.
 */
export const calculateDuration = (entryTime, exitTime) => {
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const durationMs = exit - entry; // Différence en millisecondes
  return Math.floor(durationMs / 60000); // Conversion en minutes
};

/**
 * Formate une durée en minutes en une chaîne lisible (ex: "2h 30min").
 */
export const formatDuration = (minutes) => {
  if (minutes < 0) return "0min";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  // Si que des heures (pas de minutes restantes)
  if (mins === 0 && hours > 0) {
    return `${hours}h`;
  }

  // Si que des minutes (moins d'une heure)
  if (hours === 0) {
    return `${mins}min`;
  }

  // Heures et minutes
  return `${hours}h ${mins}min`;
};

/**
 * Calcule le montant à payer.
 * La règle métier est : "toute heure commencée est due".
 */
export const calculatePrice = (entryTime, exitTime, pricePerHour) => {
  const durationMinutes = calculateDuration(entryTime, exitTime);

  // Math.ceil arrondit à l'entier supérieur
  // 1 minute -> 1 heure, 61 minutes -> 2 heures
  const hours = Math.ceil(durationMinutes / 60);

  return hours * pricePerHour;
};

/**
 * Formate une date en heure lisible (ex: "14h20").
 * padStart(2, '0') assure qu'on a toujours deux chiffres (ex: 09:05).
 */
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}h${minutes}`;
};

/**
 * Retourne la date et l'heure actuelles au format ISO.
 */
export const getCurrentDateTime = () => {
  return new Date().toISOString();
};

/**
 * Formate une date complète (ex: "29 Nov 2025 à 14h20").
 */
export const formatFullDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const months = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} à ${hours}h${minutes}`;
};

/**
 * Formate une date courte (ex: "29/11/2025").
 */
export const formatShortDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formate le montant en FCFA (ex: "1 500 FCFA").
 */
export const formatAmount = (amount) => {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
};
