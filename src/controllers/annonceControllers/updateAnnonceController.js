// controllers/annonceControllers/updateAnnonceController.js (AMÉLIORÉ avec Validation de Format)

const {
    updateAnnonceService,
    NotFoundError,
    ForbiddenError,
    APIError
} = require('../../services/annonceServices/updateAnnonceService');

// Expression régulière pour vérifier le format standard d'un slug : 
// minuscules, chiffres, séparés par des tirets, peut commencer par @ (comme les vitrines ou annonces auto-générées)
const SLUG_FORMAT_REGEX = /^@?[a-z0-9]+(?:-[a-z0-9]+)*$/;

const updateAnnonceController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const slug = req.params.slug;
        const updates = req.body;

        // 1. Validation de base
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "Aucune donnée fournie pour la mise à jour." });
        }

        // 2. 🔍 VÉRIFICATION DE LA VALIDITÉ DU FORMAT DU SLUG
        if (updates.slug) {
            if (!SLUG_FORMAT_REGEX.test(updates.slug)) {
                return res.status(400).json({
                    success: false,
                    message: "Le format du slug est invalide. Il doit être en minuscules, sans accents, sans caractères spéciaux (sauf tirets), et ne doit pas commencer ou finir par un tiret (ex: 'mon-nouveau-produit-unique')."
                });
            }
        }

        // 3. Appel du service
        const updatedAnnonce = await updateAnnonceService(slug, userId, updates);

        // 4. Succès
        return res.status(200).json({ success: true, annonce: updatedAnnonce });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'annonce:", error.message, error.stack);

        // 5. Gestion des erreurs typées du Service

        // 404: Annonce introuvable
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }

        // 403: Accès refusé
        if (error instanceof ForbiddenError) {
            return res.status(403).json({ success: false, message: error.message });
        }

        // Erreurs Métier spécifiques (409 Conflict, 400 Bad Request, etc.)
        if (error instanceof APIError) {
            return res.status(error.statusCode || 400).json({ success: false, message: error.message });
        }

        // Erreur serveur générique
        return res.status(500).json({ success: false, message: "Erreur serveur inattendue." });
    }
};

module.exports = updateAnnonceController;