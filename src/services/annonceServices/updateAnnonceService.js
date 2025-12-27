const AnnonceModel = require('../../models/annonceModel');

const updateAnnonceService = async (slug, userId, updates) => {
    const annonce = await AnnonceModel.findBySlug(slug);
    if (!annonce) throw new Error("Annonce introuvable.");

    if (annonce.ownerId !== userId) {
        throw new Error("Accès refusé.");
    }

    if (updates.slug && updates.slug !== annonce.slug) {
        const unique = await AnnonceModel.isSlugUnique(updates.slug);
        if (!unique) throw new Error("Slug déjà utilisé.");
    }

    delete updates.annonceId;
    delete updates.ownerId;
    delete updates.vitrineId;
    delete updates.vitrineSlug;

    if (updates.locations && typeof updates.locations === 'string') {
        updates.locations = updates.locations.split(',').map(l => l.trim()).filter(Boolean);
    }

    return AnnonceModel.update(slug, updates);
};

module.exports = updateAnnonceService;
