const VitrinesModel = require('../../models/vitrine-model');

const getAllVitrinesService = async ({ category, search, page = 1, limit = 6 } = {}) => {
  let vitrines = await VitrinesModel.getAll();

  if (category && category !== 'all') {
    vitrines = vitrines.filter(v => v.type?.toLowerCase() === category.toLowerCase());
  }

  if (search?.trim()) {
    const searchLower = search.toLowerCase().trim();
    vitrines = vitrines.filter(v =>
      v.name?.toLowerCase().includes(searchLower) ||
      v.description?.toLowerCase().includes(searchLower) ||
      v.type?.toLowerCase().includes(searchLower)
    );
  }

  const total = vitrines.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = vitrines.slice(start, end).map(v => {
    const { _id, ...cleaned } = v;
    return cleaned;
  });

  return { vitrines: paginated, total, page, limit, hasMore: end < total };
};

module.exports = getAllVitrinesService;
