// controllers/vitrineControllers/getAllVitrinesForOwnerController.js
const getAllVitrinesForOwnerService = require('../../services/vitrineServices/getAllVitrinesForOwnerService');

/**
 * Contrôleur pour obtenir toutes les vitrines d'un propriétaire connecté.
 */
const getAllVitrinesForOwnerController = async (req, res) => {
    try {
        // 💡 CORRECTION: L'ID du propriétaire doit venir du token JWT (req.user) 
        // pour garantir que l'utilisateur ne voit que ses propres vitrines.
        const ownerId = req.user.userId;

        // Appel du service
        const vitrines = await getAllVitrinesForOwnerService(ownerId);

        // Si aucune vitrine n'est trouvée, retourner un tableau vide et 200 (ce qui est standard pour une liste)
        // 💡 CORRECTION: Envelopper dans { success: true, vitrines } pour le Frontend
        return res.status(200).json({ success: true, vitrines });
    } catch (error) {
        console.error("Erreur getAllVitrinesForOwnerController:", error);

        let statusCode = 500; // Par défaut: Erreur serveur interne

        // Si l'erreur provient du manque d'ID (validation du service)
        if (error.message.includes("Owner ID requis")) {
            statusCode = 400; // Bad Request
        } else if (error.message.includes("Échec de la récupération")) {
            // Si le service est modifié pour renvoyer une erreur explicite 500
            statusCode = 500;
        }

        return res.status(statusCode).json({
            message: statusCode === 500 ? "Erreur serveur lors de la récupération des vitrines." : error.message,
            success: false
        });
    }
};

module.exports = getAllVitrinesForOwnerController;