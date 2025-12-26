const VitrinesModel = require('../../models/vitrine-model');
const { generateSlug, generateUniqueId } = require('../../utils/vitrineUtils');

const createVitrineService = {
  createVitrine: async (ownerId, vitrineData) => {
    let slug = generateSlug(vitrineData.name);
    while (!(await VitrinesModel.isSlugUnique(slug))) {
      slug = generateSlug(vitrineData.name);
    }

    let vitrineId = generateUniqueId();
    while (!(await VitrinesModel.isVitrineIdUnique(vitrineId))) {
      vitrineId = generateUniqueId();
    }

    const newVitrine = {
      vitrineId,
      slug,
      ownerId,
      name: vitrineData.name,
      type: vitrineData.type || 'general',
      description: vitrineData.description || '',
      avatar: vitrineData.avatar || '',
      coverImage: vitrineData.coverImage || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await VitrinesModel.create(newVitrine);
  }
};

module.exports = createVitrineService;
