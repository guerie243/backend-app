// controllers/vitrineControllers/deleteVitrineController.js
const deleteVitrineService = require('../../services/vitrineServices/deleteVitrineService');

const deleteVitrineController = async (req, res) => {
    try {
        // --- Owner ID depuis le token JWT (authMiddleware) ---
        const ownerId = req.user?.userId;
        const { slug } = req.params;

        // Vérification de base (souvent gérée par le middleware d'auth, mais ajoutée pour la robustesse)
        if (!ownerId) {
            return res.status(401).json({ message: "Token d'authentification ou Owner ID manquant." });
        }

        // Appel du service pour supprimer la vitrine
        const deletedVitrine = await deleteVitrineService.deleteVitrine(ownerId, slug);

        // Utilisation du statut 204 No Content est une alternative sémantique pour une suppression réussie
        return res.status(200).json({
            message: "Vitrine supprimée avec succès.",
            vitrine: deletedVitrine
        });

    } catch (error) {

        // --- Gestion Sémantique des Erreurs ---
        let statusCode = 400; // Par défaut: Bad Request (pour les erreurs de validation, etc.)

        if (error.message.includes("introuvable")) {
            statusCode = 404; // Not Found
        } else if (error.message.includes("Accès refusé")) {
            statusCode = 403; // Forbidden
        } else if (error.message.includes("Erreur interne du serveur")) {
            statusCode = 500; // Internal Server Error (pour les erreurs DB/système)
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = deleteVitrineController;