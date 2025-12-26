// src/utils/comparePassword.js
const bcrypt = require('bcrypt');
const { HASH_SECRET } = require('../config/config');

/**
 * Compare un mot de passe en clair avec un mot de passe haché.
 * On recompose le même input (password + pepper) et on utilise bcrypt.compare.
 *
 * @param {string} password - mot de passe en clair fourni par l'utilisateur
 * @param {string} hashedPassword - mot de passe haché stocké en base
 * @returns {Promise<boolean>} true si correspond, false sinon
 */
async function comparePassword(password, hashedPassword) {
  try {
    if (!password || !hashedPassword) return false;

    const input = `${password}${HASH_SECRET}`;
    const match = await bcrypt.compare(input, hashedPassword);
    return match;
  } catch (err) {
    console.error('Erreur comparePassword :', err);
    throw new Error('Erreur lors de la comparaison des mots de passe.');
  }
}

module.exports = comparePassword;
