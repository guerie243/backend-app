/**
 * Utilitaire pour générer des liens WhatsApp à partir de numéros de téléphone
 * 
 * Ce module fournit une fonction pour créer des liens WhatsApp cliquables
 * qui permettent aux utilisateurs de contacter facilement les propriétaires
 * de vitrines via WhatsApp.
 */

/**
 * Génère un lien WhatsApp à partir d'un numéro de téléphone
 * 
 * @param {string} phoneNumber - Le numéro de téléphone (peut contenir des espaces, +, -, etc.)
 * @param {string} [message] - Message pré-rempli optionnel à envoyer
 * @returns {string|null} Le lien WhatsApp formaté ou null si le numéro est invalide
 * 
 * @example
 * // Lien simple
 * generateWhatsAppLink("+33 6 12 34 56 78")
 * // => "https://wa.me/33612345678"
 * 
 * @example
 * // Lien avec message pré-rempli
 * generateWhatsAppLink("+33612345678", "Bonjour, je suis intéressé par votre produit")
 * // => "https://wa.me/33612345678?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20votre%20produit"
 */
const generateWhatsAppLink = (phoneNumber, message = null) => {
    // Vérification : si le numéro est vide ou invalide, retourner null
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return null;
    }

    try {
        // Étape 1 : Nettoyer le numéro de téléphone
        // Retirer tous les caractères non numériques sauf le +
        let cleanedNumber = phoneNumber.trim();

        // Retirer les espaces, tirets, parenthèses, points
        cleanedNumber = cleanedNumber.replace(/[\s\-\(\)\.\[\]]/g, '');

        // Étape 2 : Gérer le format international
        // Si le numéro commence par +, on le garde
        // Si le numéro commence par 0 (format local français), on le convertit
        if (cleanedNumber.startsWith('+')) {
            // Retirer le + pour le lien WhatsApp
            cleanedNumber = cleanedNumber.substring(1);
        } else if (cleanedNumber.startsWith('0')) {
            // Convertir le format local français (0X) en international (33X)
            // Exemple : 0612345678 => 33612345678
            cleanedNumber = '33' + cleanedNumber.substring(1);
        }

        // Étape 3 : Validation finale - vérifier que le numéro ne contient que des chiffres
        if (!/^\d+$/.test(cleanedNumber)) {
            console.warn(`Numéro de téléphone invalide après nettoyage: ${phoneNumber}`);
            return null;
        }

        // Étape 4 : Vérifier que le numéro a une longueur raisonnable (entre 8 et 15 chiffres)
        if (cleanedNumber.length < 8 || cleanedNumber.length > 15) {
            console.warn(`Longueur de numéro invalide: ${cleanedNumber.length} chiffres`);
            return null;
        }

        // Étape 5 : Construire le lien WhatsApp
        let whatsappLink = `https://wa.me/${cleanedNumber}`;

        // Étape 6 : Ajouter le message pré-rempli si fourni
        if (message && typeof message === 'string' && message.trim().length > 0) {
            // Encoder le message pour l'URL
            const encodedMessage = encodeURIComponent(message.trim());
            whatsappLink += `?text=${encodedMessage}`;
        }

        return whatsappLink;

    } catch (error) {
        // En cas d'erreur, logger et retourner null pour ne pas faire planter l'application
        console.error('Erreur lors de la génération du lien WhatsApp:', error);
        return null;
    }
};

module.exports = generateWhatsAppLink;
