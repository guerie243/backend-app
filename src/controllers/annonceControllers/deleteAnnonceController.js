// controllers/annonceControllers/deleteAnnonceController.js (AMÉLIORÉ)

const { 
    deleteAnnonceService,
    NotFoundError,
    ForbiddenError,
    APIError
} = require('../../services/annonceServices/deleteAnnonceService');

const deleteAnnonceController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const slug = req.params.slug;

        // Appel du service
        await deleteAnnonceService(slug, userId);

        // 204 No Content est la meilleure pratique pour une suppression réussie sans corps de réponse.
        return res.status(204).send(); 
        
    } catch (error) {
        console.error("Erreur lors de la suppression de l'annonce:", error.message);

        // --- Gestion des erreurs typées du Service ---
        
        // 404: Annonce introuvable
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        
        // 403: Accès refusé
        if (error instanceof ForbiddenError) {
            return res.status(403).json({ success: false, message: error.message });
        }
        
        // Erreurs Internes (ex: 500 pour échec DB) ou autres APIError
        if (error instanceof APIError) {
            return res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
        
        // Erreur serveur générique
        return res.status(500).json({ success: false, message: "Erreur serveur inattendue." });
    }
};

module.exports = deleteAnnonceController;