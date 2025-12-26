const AnnonceModel = require('../../models/annonceModel');

const getAnnonceBySlugService = async (slug) => {
    return AnnonceModel.findBySlug(slug);
};

module.exports = getAnnonceBySlugService;
