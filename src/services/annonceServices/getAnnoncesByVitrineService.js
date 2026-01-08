const AnnonceModel = require('../../models/annonceModel');

const getAnnoncesByVitrineService = async (vitrineIdOrSlug, page = 1, limit = 10) => {
    // Si c'est un ID (commence par vit_), on utilise getByVitrineId
    if (vitrineIdOrSlug && vitrineIdOrSlug.startsWith('vit_')) {
        return AnnonceModel.getByVitrineId({ vitrineId: vitrineIdOrSlug, limit });
    }

    // Sinon on reste sur le slug pour la compatibilité
    return AnnonceModel.getByVitrineSlug({ vitrineSlug: vitrineIdOrSlug, limit });
};

module.exports = getAnnoncesByVitrineService;
