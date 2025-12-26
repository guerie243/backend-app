// services/annonceServices/deleteAnnonceService.js (AMÉLIORÉ)

const AnnonceModel = require('../../models/annonceModel');

// --- Classes d'erreurs typées ---
class APIError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}
class NotFoundError extends APIError {
    constructor(message = "Annonce introuvable.") {
        super(message, 404);
    }
}
class ForbiddenError extends APIError {
    constructor(message = "Accès refusé. Vous n'êtes pas le propriétaire de cette annonce.") {
        super(message, 403);
    }
}

const deleteAnnonceService = async (slug, userId) => {
    // 1. Trouver l'annonce (ou lancer 404)
    const annonce = await AnnonceModel.findBySlug(slug);
    if (!annonce) {
        throw new NotFoundError();
    }

    // 2. Vérification de la propriété (ou lancer 403)
    if (annonce.ownerId.toString() !== userId.toString()) {
        throw new ForbiddenError();
    }

    // 3. Suppression
    // AnnonceModel.delete doit renvoyer l'élément supprimé ou le nombre d'éléments supprimés (1 en cas de succès).
    const deleteResult = await AnnonceModel.delete(slug);
    
    // Si l'élément a été trouvé mais n'a pas été supprimé (problème DB), on pourrait lever 500.
    if (!deleteResult) {
        // Dans ce scénario, on sait que l'annonce existait. Si la suppression échoue, c'est un problème interne.
        throw new APIError("Échec de la suppression dans la base de données.", 500); 
    }
    
    return deleteResult;
};

// Exportation du service ET des erreurs
module.exports = {
    deleteAnnonceService,
    NotFoundError,
    ForbiddenError,
    APIError
};