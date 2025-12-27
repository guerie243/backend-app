const AnnonceModel = require('../../models/annonceModel');

class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class NotFoundError extends APIError {
    constructor(message = 'Ressource introuvable') {
        super(message, 404);
    }
}

class ForbiddenError extends APIError {
    constructor(message = 'Accès refusé') {
        super(message, 403);
    }
}

const updateAnnonceService = async (slug, userId, updates) => {
    const annonce = await AnnonceModel.findBySlug(slug);
    if (!annonce) throw new NotFoundError("Annonce introuvable.");

    if (annonce.ownerId !== userId) {
        throw new ForbiddenError("Accès refusé.");
    }

    if (updates.slug && updates.slug !== annonce.slug) {
        const unique = await AnnonceModel.isSlugUnique(updates.slug);
        if (!unique) throw new APIError("Slug déjà utilisé.", 409);
    }

    delete updates.annonceId;
    delete updates.ownerId;
    delete updates.vitrineId;
    delete updates.vitrineSlug;
    delete updates.vitrineCategory;

    if (updates.locations && typeof updates.locations === 'string') {
        updates.locations = updates.locations.split(',').map(l => l.trim()).filter(Boolean);
    }

    return AnnonceModel.update(slug, updates);
};

module.exports = {
    updateAnnonceService,
    NotFoundError,
    ForbiddenError,
    APIError
};
