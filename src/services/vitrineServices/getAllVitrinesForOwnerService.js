// services/vitrineServices/getAllVitrinesForOwnerService.js
const VitrinesModel = require('../../models/vitrine-model');

/**
 * Service pour récupérer toutes les vitrines d'un propriétaire.
 * @param {string} ownerId - ID du propriétaire
 * @returns {Array} Liste des vitrines du propriétaire (sans _id)
 */
const getAllVitrinesForOwnerService = async (ownerId) => {
      if (!ownerId) {
            throw new Error("Owner ID requis pour récupérer les vitrines.");
      }

      try {
            const vitrines = await VitrinesModel.getByOwnerId(ownerId);

            // 🔑 Nettoyage du tableau avant le retour
            const cleanedVitrines = vitrines.map(vitrine => {
                  // Convertir en objet JavaScript simple
                  const cleaned = vitrine.toObject ? vitrine.toObject() : { ...vitrine };
                  delete cleaned._id;
                  // L'ownerId doit être conservé pour le frontend (isOwner check)
                  // delete cleaned.ownerId;
                  return cleaned;
            });

            return cleanedVitrines;

      } catch (dbError) {
            console.error("Erreur DB getAllVitrinesForOwnerService:", dbError);
            // Lève une erreur de système explicite
            throw new Error("Échec de la récupération des vitrines en base de données.");
      }
};

module.exports = getAllVitrinesForOwnerService;