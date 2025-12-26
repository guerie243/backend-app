// utils/vitrineUtils.js
const crypto = require("crypto");
const VitrinesModel = require("../models/vitrine-model");

/**
 * Génère un slug unique à partir du nom de la vitrine.
 * @param {string} vitrineName - Nom de la vitrine fourni par l'utilisateur.
 * @returns {string} Slug unique commençant par '@'
 */
const generateSlug = (vitrineName) => {
  // Nettoyer le nom pour créer la base
  let baseName = vitrineName
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
    .replace(/[^a-z0-9]+/g, "_") // Remplace non-alphanumériques par '_'
    .replace(/^_+|_+$/g, ""); // Enlève les '_' au début/fin

  if (!baseName) baseName = "vitrine";

  let slug;
  let attempts = 0;
  do {
    const suffix = crypto.randomBytes(2).toString("hex"); // 4 caractères hex
    slug = `@${baseName}_${suffix}`; // Toujours commencer par '@'
    attempts++;
    if (attempts > 10) {
      throw new Error("Impossible de générer un slug unique après 10 tentatives.");
    }
  } while (!VitrinesModel.isSlugUnique(slug));

  return slug;
};

/**
 * Génère un ID unique pour une vitrine.
 * Exemple : "vitrine_4f3a9b82b1c7"
 * @returns {string} ID unique
 */
const generateUniqueId = (prefix = "vit") => {
  let uniqueId;
  let attempts = 0;
  do {
    const randomPart = crypto.randomBytes(6).toString("hex"); // 12 caractères hex
    uniqueId = `${prefix}_${randomPart}`;
    attempts++;
    if (attempts > 10) {
      throw new Error("Impossible de générer un vitrineId unique après 10 tentatives.");
    }
  } while (!VitrinesModel.isVitrineIdUnique(uniqueId));

  return uniqueId;
};

module.exports = {
  generateSlug,
  generateUniqueId,
};
