const updateVitrineService = require('../../services/vitrineServices/updateVitrineService');

const updateVitrine = async (req, res) => {
    try {
        // 💡 CORRECTION : Utilisation de req.user.userId comme défini par le middleware JWT
        const ownerId = req.user.userId;
        const { slug } = req.params; // Slug de la vitrine à modifier
        const updateData = req.body; // Données envoyées dans le corps de la requête

        // Appel du service de mise à jour
        const updated = await updateVitrineService.updateVitrine(ownerId, slug, updateData);

        return res.status(200).json({
            success: true,
            message: "Vitrine mise à jour avec succès",
            vitrine: updated // CORRECTION: renaming 'data' to 'vitrine' to match frontend
        });

    } catch (error) {
        // Gestion des erreurs provenant du service (validation, permission, DB)

        let statusCode = 400; // Par défaut pour les erreurs de validation ou non trouvées

        if (error.message.includes("permission")) {
            statusCode = 403; // Forbidden
        } else if (error.message.includes("introuvable")) {
            statusCode = 404; // Not Found
        } else if (error.message.includes("sauvegarde") || error.message.includes("base de données")) {
            statusCode = 500; // Internal Server Error pour les erreurs DB
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

// CORRECTION : Remplacement de updateVitrineController par la variable déclarée : updateVitrine
module.exports = updateVitrine;