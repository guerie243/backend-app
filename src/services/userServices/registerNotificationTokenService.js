const UserModel = require('../../models/userModel');

/**
 * Enregistre un nouveau token de notification pour un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} type - Type de token ('firebase' ou 'webpush')
 * @param {Object|String} tokenData - Données du token
 * @returns {Object} Résultat de l'opération
 */
const registerNotificationTokenService = async (userId, type, tokenData) => {
    await UserModel.addNotificationToken(userId, type, tokenData);
    return { success: true, message: 'Token enregistré avec succès' };
};

module.exports = registerNotificationTokenService;
