export function parseAlertMessage(rawMessage: string): string | null {
  if (!rawMessage) return null;

  const lowerMessage = rawMessage.toLowerCase();

  // Messages de succès à ignorer
  if (
    [
      "traité avec succès",
      "terminé avec succès",
      "aucun changement détecté",
      "révision synchronisée",
      "liste blanche",
      "aucun district trouvé",
      "utilise des banid",
      "n'utilise pas de banid",
    ].some((msg) => lowerMessage.includes(msg))
  ) {
    return null;
  }

  // JOB ÉCHOUÉ
  if (lowerMessage.includes("job") && lowerMessage.includes("échoué")) {
    return rawMessage.includes("updateDate is a required field")
      ? "Révision courante non synchronisée avec la base - Date mise à jour manquante"
      : "Révision courante non synchronisée avec la base - Erreur interne contacter le support";
  }

  // DROITS MANQUANTS
  if (lowerMessage.includes("droits manquants")) {
    const match = rawMessage.match(/droits manquants,\s*(.*)/i);
    return match
      ? `Révision courante non synchronisée avec la base - Droits manquants, ${match[1]}`
      : "Droits manquants";
  }

  // OPÉRATION NON AUTORISÉE
  if (lowerMessage.includes("opération non autorisée")) {
    let result =
      "Révision courante non synchronisée avec la base - Opération non autorisée\n\nIdentifiants déjà utilisés dans la base:";

    const addressMatch = rawMessage.match(
      /adresses non autorisées\s*:\s*`([^`]+)`/i
    );
    const toponymMatch = rawMessage.match(
      /toponymes non autorisés\s*:\s*`([^`]+)`/i
    );

    if (addressMatch) {
      result +=
        "\n\nAdresses:\n" +
        addressMatch[1]
          .split(",")
          .map((id) => `• ${id.trim()}`)
          .join("\n");
    }
    if (toponymMatch) {
      result +=
        "\n\nToponymes:\n" +
        toponymMatch[1]
          .split(",")
          .map((id) => `• ${id.trim()}`)
          .join("\n");
    }

    return result;
  }

  // SEUIL DE SUPPRESSION
  if (
    lowerMessage.includes("seuil de suppression") ||
    lowerMessage.includes("exceeded")
  ) {
    let result = "Seuil de suppression dépassé\n\nDépassé:";

    const addressMatch = rawMessage.match(
      /addresses:\s*([0-9.,]+%)\s*\(([0-9,]+)\/([0-9,]+)\)/i
    );
    const toponymMatch = rawMessage.match(
      /toponyms:\s*([0-9.,]+%)\s*\(([0-9,]+)\/([0-9,]+)\)/i
    );

    if (addressMatch)
      result += `\nAdresses: ${addressMatch[1]} (${addressMatch[2]}/${addressMatch[3]})`;
    if (toponymMatch)
      result += `\nToponymes: ${toponymMatch[1]} (${toponymMatch[2]}/${toponymMatch[3]})`;

    return result;
  }

  // DONNÉES MANQUANTES - patterns spécifiques
  const missingData = {
    "addressid manquant": "addressID",
    "districtid manquant": "districtID",
    "maintopoid manquant": "mainTopoID",
    "ids manquants": "IDs",
  };

  for (const [pattern, type] of Object.entries(missingData)) {
    if (lowerMessage.includes(pattern)) {
      // Si déjà dans le nouveau système, pas d'enregistrement mais validation
      if (
        lowerMessage.includes(
          "le district est enregistré dans le nouveau système"
        )
      ) {
        return `Révision courante non synchronisée avec la base - ${type} manquant - Consulter le rapport de validation`;
      }
      return `Enregistrement de la BAL sans les identifiants - ${type} manquant - Consulter le rapport de validation`;
    }
  }

  if (lowerMessage.includes("enregistrement de la bal sans les identifiants")) {
    return "Enregistrement de la BAL sans les identifiants - Consulter le rapport de validation";
  }

  // ERREURS INTERNES
  if (
    ["api ban", "api dump", "timeout"].some((err) => lowerMessage.includes(err))
  ) {
    return "Révision courante non synchronisée avec la base - Erreur interne contactez le support";
  }

  return null;
}
