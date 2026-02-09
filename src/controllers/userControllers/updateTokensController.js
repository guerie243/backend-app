const UserModel = require('../../models/userModel');

/**
 * @desc    Mettre à jour les tokens de notification
 * @route   PATCH /api/users/tokens
 * @access  Private (nécessite authentification)
 */
const updateTokensController = async (req, res) => {
    try {
        const userId = req.user.userId; // Depuis authMiddleware (c'est .userId et non ._id)
        const { firebaseToken, webPushSubscription } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non identifié'
            });
        }

        console.log('[updateTokensController] userId:', userId);

        // Mises à jour séquentielles via UserModel.addNotificationToken
        const promises = [];

        if (firebaseToken) {
            console.log('[updateTokensController] Ajout Firebase token');
            promises.push(UserModel.addNotificationToken(userId, 'firebase', firebaseToken));
        }

        if (webPushSubscription && typeof webPushSubscription === 'object') {
            console.log('[updateTokensController] Ajout Web Push subscription');
            promises.push(UserModel.addNotificationToken(userId, 'webpush', webPushSubscription));
        }

        if (promises.length > 0) {
            await Promise.all(promises);
            console.log('[updateTokensController] Tokens mis à jour avec succès');
        } else {
            console.log('[updateTokensController] Aucun token fourni');
        }

        // Récupérer les tokens mis à jour pour confirmation
        const updatedTokens = await UserModel.getNotificationTokens(userId);

        res.status(200).json({
            success: true,
            message: 'Tokens mis à jour',
            tokens: updatedTokens
        });
    } catch (error) {
        console.error('[updateTokensController] Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

module.exports = updateTokensController;
