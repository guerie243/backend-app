const AnnonceModel = require('../../models/annonceModel');

const getAnnoncesByVitrineService = async (vitrineSlug, page = 1, limit = 10) => {
    return AnnonceModel.getByVitrineSlug(vitrineSlug, page, limit);
};

module.exports = getAnnoncesByVitrineService;
