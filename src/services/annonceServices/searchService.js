const AnnonceModel = require('../../models/annonceModel');
const VitrinesModel = require('../../models/vitrine-model');

/**
 * Recherche d'annonces avec vérification de la vitrine
 * Pagination Firestore propre (cursor)
 */
const searchAnnonceService = async ({
    query,
    limit = 10,
    startAfter = null
}) => {
    // 1. Recherche annonces (basique Firestore)
    const annonces = await AnnonceModel.searchByText({
        query,
        limit,
        startAfter
    });

    if (annonces.length === 0) {
        return {
            results: [],
            nextCursor: null
        };
    }

    // 2. Vérifier les vitrines associées
    const validResults = [];

    for (const annonce of annonces) {
        const vitrine = await VitrinesModel.findByVitrineId(annonce.vitrineId);

        if (!vitrine) continue;
        if (vitrine.isActive !== true) continue;

        validResults.push(annonce);
    }

    // 3. Pagination
    const lastAnnonce = validResults[validResults.length - 1];

    return {
        results: validResults,
        nextCursor: lastAnnonce ? lastAnnonce.annonceId : null
    };
};

module.exports = searchAnnonceService;
