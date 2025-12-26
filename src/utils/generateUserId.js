const crypto = require("crypto");

/**
 * Génère un identifiant unique.
 * Exemple de sortie : "usr_4f3a9b82b1c7"
 */
function generateUniqueId(prefix = "usr") {
    try {
        // 6 bytes = 12 caractères hex → largement suffisant
        const randomPart = crypto.randomBytes(6).toString("hex");

        // Format final : prefix_randomHex
        return `${prefix}_${randomPart}`;
    } catch (error) {
        console.error("Erreur generateUniqueId :", error);
        throw new Error("Impossible de générer un identifiant unique.");
    }
}

module.exports = generateUniqueId;
