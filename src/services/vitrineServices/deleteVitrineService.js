// services/vitrineServices/deleteVitrineService.js
const VitrinesModel = require('../../models/vitrine-model');

const deleteVitrineService = {
  deleteVitrine: async (ownerId, slug) => {
    // --- 1. Vérifier si la vitrine existe ---
    const vitrine = await VitrinesModel.findBySlug(slug);
    if (!vitrine) {
      throw new Error("Vitrine introuvable.");
    }

    // --- 2. Vérifier l'autorisation du propriétaire ---
    // Utilisation de .toString() pour s'assurer que les comparaisons entre ObjectId/String sont fiables.
    if (vitrine.ownerId.toString() !== ownerId.toString()) {
      throw new Error("Accès refusé. Vous n'avez pas la permission de supprimer cette vitrine.");
    }

    // --- 3. Supprimer la vitrine et gérer les erreurs DB ---
    try {
      const removedVitrine = await VitrinesModel.deleteBySlug(slug);
      return removedVitrine;
    } catch (dbError) {
      console.error("Erreur de base de données lors de la suppression de la vitrine:", dbError);
      throw new Error("Erreur interne du serveur lors de la suppression de la vitrine.");
    }
  }
};

module.exports = deleteVitrineService;