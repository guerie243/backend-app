const VitrinesModel = require('../../models/vitrine-model');

const getAllVitrinesForOwnerService = async (ownerId) => {
  if (!ownerId) throw new Error("Owner ID requis.");
  const vitrines = await VitrinesModel.getByOwnerId(ownerId);
  return vitrines.map(v => {
    const { _id, ...cleaned } = v;
    return cleaned;
  });
};

module.exports = getAllVitrinesForOwnerService;
