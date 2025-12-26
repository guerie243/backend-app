const AnnonceModel = require('../../models/annonceModel');

const getAnnoncesByVitrineService = async (vitrineSlug, page = 1, limit = 10) => {
    // Note: Le modèle attend un objet destructuré { vitrineSlug, limit, cursor }
    // Pour l'instant on ignore 'page' car le modèle utilise des curseurs, 
    // ou on pourrait mapper page -> offset si le modèle le supportait.
    // Cette correction évite le crash 500.
    return AnnonceModel.getByVitrineSlug({ vitrineSlug, limit });
};

module.exports = getAnnoncesByVitrineService;
