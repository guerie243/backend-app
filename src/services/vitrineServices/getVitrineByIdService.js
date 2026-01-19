const VitrinesModel = require('../../models/vitrine-model');

/**
 * Récupère les informations d'une vitrine par son ID
 * @param {string} vitrineId - ID de la vitrine
 * @returns {Object} Informations de la vitrine
 */
const getVitrineByIdService = async (vitrineId) => {
    const vitrine = await VitrinesModel.findByVitrineId(vitrineId);

    if (!vitrine) {
        throw new Error("Vitrine non trouvée");
    }

    return vitrine;
};

module.exports = getVitrineByIdService;
