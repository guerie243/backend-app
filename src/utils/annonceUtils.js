// utils/annonceUtils.js
const crypto = require('crypto');

/**
 * Génère (purement) un ID d'annonce aléatoire.
 * NE vérifie PAS l'unicité en base (c'est le rôle du service).
 */
const generateUniqueAnnonceId = () => {
  return `ann_${crypto.randomBytes(4).toString('hex')}`; // ex: ann_a1b2c3d4
};

/**
 * Génère (purement) un slug à partir du titre.
 * NE vérifie PAS l'unicité en base (c'est le rôle du service).
 */
const generateUniqueAnnonceSlug = (title = '') => {
  let base = String(title || '')
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // supprimer accents
    .replace(/[^a-z0-9]+/g, '-') // remplacer non alphanum par '-'
    .replace(/^-+|-+$/g, '');

  if (!base) base = 'annonce';

  const suffix = crypto.randomBytes(2).toString('hex'); // 4 hex chars
  return `@${base}-${suffix}`; // ex: @chaussures-nike-1a2b
};

module.exports = {
  generateUniqueAnnonceId,
  generateUniqueAnnonceSlug
};
