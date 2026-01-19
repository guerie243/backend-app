const registerNotificationTokenService = require('../../services/userServices/registerNotificationTokenService');

/**
 * @desc    Enregistrer un token de notification
 * @route   POST /api/users/notifications/register
 * @access  Private (nécessite authentification)
 */
const registerNotificationTokenController = async (req, res) => {
    try {
        const userId = req.user._id; // Depuis authMiddleware
        const { type, token } = req.body;

        // Validation des champs
        if (!type || !token) {
            return res.status(400).json({
                success: false,
                message: 'Type et token requis'
            });
        }

        // Validation du type
        if (type !== 'firebase' && type !== 'webpush') {
            return res.status(400).json({
                success: false,
                message: 'Type invalide (firebase ou webpush)'
            });
        }

        const result = await registerNotificationTokenService(userId, type, token);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error registering notification token:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = registerNotificationTokenController;
