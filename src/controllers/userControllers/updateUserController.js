const { updateUserProfile } = require('../../services/userServices/updateUserService');

/**
 * Contrôleur pour mettre à jour le profil de l'utilisateur connecté.
 */
const updateUserController = async (req, res) => {
    try {
        // L'ID utilisateur est extrait du token JWT par le middleware d'authentification
        const userId = req.user.userId;
        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Aucune donnée fournie pour la mise à jour."
            });
        }

        // Appel du service de mise à jour du profil utilisateur
        const updatedUser = await updateUserProfile(userId, updateData);

        return res.status(200).json({
            success: true,
            message: "Profil mis à jour avec succès",
            user: updatedUser
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil utilisateur:", error.message);

        let statusCode = 400;
        if (error.message.includes("not found") || error.message.includes("trouvé")) {
            statusCode = 404;
        } else if (error.message.includes("incorrect")) {
            statusCode = 401;
        } else if (error.message.includes("utilisé")) {
            statusCode = 409;
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = updateUserController;