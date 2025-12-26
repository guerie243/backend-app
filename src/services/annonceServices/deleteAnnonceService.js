const AnnonceModel = require('../../models/annonce-model');

const deleteAnnonceService = async (slug, userId) => {
  const annonce = await AnnonceModel.findBySlug(slug);
  if (!annonce) throw new Error("Annonce introuvable.");

  if (annonce.ownerId !== userId) {
    throw new Error("Accès refusé.");
  }

  return AnnonceModel.delete(slug);
};

module.exports = deleteAnnonceService;
