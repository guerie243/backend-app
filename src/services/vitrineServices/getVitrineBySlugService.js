// services/vitrineServices/getVitrineService.js
const VitrinesModel = require('../../models/vitrine-model');
const generateWhatsAppLink = require('../../utils/generateWhatsAppLink');

/**
 * Service pour récupérer une vitrine par son slug.
 * @param {string} slug - Identifiant public de la vitrine
 * @returns {object|null} La vitrine nettoyée (sans _id) si trouvée, sinon null
 */
const getVitrineBySlugService = async (slugOrId) => {
  if (!slugOrId) {
    // Erreur de validation levée pour le contrôleur
    throw new Error("L'identifiant (slug ou ID) de la vitrine est requis.");
  }

  try {
    let vitrine;

    // Si c'est un ID, on cherche par ID
    if (slugOrId && slugOrId.includes('-')) {
      vitrine = await VitrinesModel.findByVitrineId(slugOrId);
    }

    // Sinon ou si non trouvé, on cherche par slug
    if (!vitrine) {
      vitrine = await VitrinesModel.findBySlug(slugOrId);
    }

    if (vitrine) {
      // 🔑 Nettoyage de l'objet avant le retour
      // Convertir l'objet BDD en objet JavaScript simple si nécessaire (par ex. avec .toObject() en Mongoose)
      const cleanedVitrine = vitrine.toObject ? vitrine.toObject() : { ...vitrine };
      delete cleanedVitrine._id;
      // ownerId is required for frontend to determine ownership status
      // delete cleanedVitrine.ownerId; 


      // 📱 Génération du lien WhatsApp si un numéro de téléphone est disponible
      // Vérifie si la vitrine a des informations de contact avec un numéro de téléphone
      if (cleanedVitrine.contact && cleanedVitrine.contact.phone) {
        // Génère le lien WhatsApp à partir du numéro de téléphone
        const whatsappLink = generateWhatsAppLink(cleanedVitrine.contact.phone);

        // Ajoute le lien WhatsApp aux informations de contact
        // Si le numéro est invalide, whatsappLink sera null
        cleanedVitrine.contact.whatsappLink = whatsappLink;
      }

      return cleanedVitrine;
    }

    return null; // Retourne null si la vitrine n'est pas trouvée

  } catch (dbError) {
    console.error("Erreur DB getVitrineBySlugService:", dbError);
    // Erreur de système levée pour le contrôleur
    throw new Error("Échec de la récupération des données de la vitrine.");
  }
};

module.exports = getVitrineBySlugService;