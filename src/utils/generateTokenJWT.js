const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Génère un JSON Web Token (JWT) pour un utilisateur.
 * @param {object} user - L'objet utilisateur (doit contenir _id, username).
 * @returns {string} Le token JWT généré.
 */
const generateTokenJWT = (user) => {
    // Payload minimal et sécurisé
    const payload = {
        // Supporte soit un objet avec _id (UserModel), soit userId (utilitaire)
        userId: user._id || user.userId,
    };

    // Génère un token SANS expiration (on peut ajouter "expiresIn" si souhaité)
    const token = jwt.sign(payload, config.JWT_SECRET);

    return token;
};

module.exports = generateTokenJWT;
