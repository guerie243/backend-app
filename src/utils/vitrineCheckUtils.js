// utils/vitrineCheckUtils.js
const VitrinesModel = require('../models/vitrine-model');

const verifyVitrineOwnership = async (userId, vitrineSlugOrId) => {
  let vitrine;

  // Try finding by ID first if it looks like an ID, otherwise try slug
  if (vitrineSlugOrId && vitrineSlugOrId.includes('-')) {
    vitrine = await VitrinesModel.findByVitrineId(vitrineSlugOrId);
  }

  if (!vitrine) {
    vitrine = await VitrinesModel.findBySlug(vitrineSlugOrId);
  }

  if (!vitrine) throw new Error(`La vitrine "${vitrineSlugOrId}" n'existe pas.`);
  if (vitrine.ownerId.toString() !== userId.toString()) throw new Error("Vous n'êtes pas propriétaire de cette vitrine.");

  return {
    ownerId: vitrine.ownerId,
    vitrineId: vitrine.vitrineId,
    vitrineSlug: vitrine.slug,
    vitrineCategory: vitrine.category || vitrine.type || 'general'
  };
};

module.exports = {
  verifyVitrineOwnership
};
