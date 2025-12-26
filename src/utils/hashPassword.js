// src/utils/hashPassword.js
const bcrypt = require('bcrypt');
const { HASH_SECRET } = require('../config/config');

/**
 * Hache un mot de passe en combinant :
 *  - le mot de passe fourni
 *  - une "pepper" (secret stocké côté serveur dans .env)
 *  - le salt généré par bcrypt
 *
 * @param {string} password - mot de passe en clair
 * @returns {Promise<string>} mot de passe haché
 */
async function hashPassword(password) {
  try {
    if (!password) throw new Error('Password manquant pour le hachage.');

    // Concaténation "password + pepper" avant hachage
    // (on pourrait aussi préfixer : `${HASH_SECRET}${password}`)
    const input = `${password}${HASH_SECRET}`;

    const saltRounds = 10; // valeur standard ; tu peux la configurer via .env si besoin
    const hashed = await bcrypt.hash(input, saltRounds);
    return hashed;
  } catch (err) {
    console.error('Erreur hashPassword :', err);
    throw new Error('Impossible de hacher le mot de passe.');
  }
}

module.exports = hashPassword;
