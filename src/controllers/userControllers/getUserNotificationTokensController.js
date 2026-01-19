const getUserNotificationTokensService = require('../../services/userServices/getUserNotificationTokensService');

/**
 * @desc    Récupérer les tokens de notification d'un utilisateur
 * @route   GET /api/users/:userId/notifications
 * @access  Public (devrait être protégé en production avec API key inter-service)
 */
const getUserNotificationTokensController = async (req, res) => {
    try {
        const { userId } = req.params;

        const tokens = await getUserNotificationTokensService(userId);

        res.status(200).json(tokens);
    } catch (error) {
        console.error('Error fetching notification tokens:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = getUserNotificationTokensController;
