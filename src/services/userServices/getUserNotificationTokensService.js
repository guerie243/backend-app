const UserModel = require('../../models/userModel');

/**
 * Récupère les tokens de notification d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Object} { firebaseTokens: [], webPushSubscriptions: [] }
 */
const getUserNotificationTokensService = async (userId) => {
    const tokens = await UserModel.getNotificationTokens(userId);
    return tokens;
};

module.exports = getUserNotificationTokensService;
