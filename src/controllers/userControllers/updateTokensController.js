const UserModel = require('../../models/userModel');

/**
 * @desc    Mettre à jour les tokens de notification
 * @route   PATCH /api/users/tokens
 * @access  Private (nécessite authentification)
 */
const updateTokensController = async (req, res) => {
    try {
        const userId = req.user._id; // Depuis authMiddleware
        const { firebaseToken, webPushSubscription } = req.body;

        console.log('[updateTokensController] userId:', userId);
        console.log('[updateTokensController] firebaseToken:', firebaseToken);
        console.log('[updateTokensController] webPushSubscription:', webPushSubscription);

        const updates = {};

        // Ajouter Firebase token s'il est fourni
        if (firebaseToken) {
            const user = await UserModel.findById(userId);
            if (!user.firebaseTokens.includes(firebaseToken)) {
                updates.$addToSet = { firebaseTokens: firebaseToken };
            }
        }

        // Ajouter Web Push subscription s'il est fourni
        if (webPushSubscription && typeof webPushSubscription === 'object') {
            const user = await UserModel.findById(userId);
            // Vérifier si cette souscription existe déjà (par endpoint)
            const exists = user.webPushSubscriptions.some(
                sub => sub.endpoint === webPushSubscription.endpoint
            );
            if (!exists) {
                if (!updates.$addToSet) updates.$addToSet = {};
                updates.$addToSet.webPushSubscriptions = webPushSubscription;
                console.log('[updateTokensController] Ajout de la subscription Web Push');
            } else {
                console.log('[updateTokensController] Subscription Web Push déjà existante');
            }
        }

        // Mettre à jour l'utilisateur si des modifications existent
        if (Object.keys(updates).length > 0) {
            await UserModel.findByIdAndUpdate(userId, updates);
            console.log('[updateTokensController] Tokens mis à jour avec succès');
        } else {
            console.log('[updateTokensController] Aucune mise à jour nécessaire');
        }

        const updatedUser = await UserModel.findById(userId);

        res.status(200).json({
            success: true,
            message: 'Tokens mis à jour',
            user: updatedUser
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
