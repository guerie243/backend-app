// utils/vitrineCheckUtils.js
const VitrinesModel = require('../models/vitrine-model');

const verifyVitrineOwnership = async (userId, vitrineSlug) => {
  const vitrine = await VitrinesModel.findBySlug(vitrineSlug);
  if (!vitrine) throw new Error(`La vitrine "${vitrineSlug}" n'existe pas.`);
  if (vitrine.ownerId.toString() !== userId.toString()) throw new Error("Vous n'êtes pas propriétaire de cette vitrine.");
  return {
    ownerId: vitrine.ownerId,
    vitrineId: vitrine.vitrineId,
    vitrineSlug: vitrine.slug,
    vitrineCategory: vitrine.type
  };
};

module.exports = {
  verifyVitrineOwnership
};
