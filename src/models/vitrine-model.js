const { getDb } = require('../config/db');

const COLLECTION = 'Vitrines';

const VitrinesModel = {

  getCollection: () => {
    return getDb().collection(COLLECTION);
  },

  /* =========================
     CREATION
  ========================== */
  create: async (vitrine) => {
    // Preserve use of vitrineId as the document identifier
    const data = { ...vitrine, _id: vitrine.vitrineId };
    await VitrinesModel.getCollection().insertOne(data);
    return vitrine;
  },

  /* =========================
     LECTURE
  ========================== */
  findBySlug: async (slug) => {
    return await VitrinesModel.getCollection().findOne({ slug: slug });
  },

  /* @deprecated Use findBySlug instead */
  findBySlog: async (slug) => {
    return await VitrinesModel.findBySlug(slug);
  },

  findByVitrineId: async (vitrineId) => {
    return await VitrinesModel.getCollection().findOne({ _id: vitrineId });
  },

  getByOwnerId: async (ownerId) => {
    return await VitrinesModel.getCollection().find({ ownerId: ownerId }).toArray();
  },

  getAll: async () => {
    return await VitrinesModel.getCollection()
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
  },

  /* =========================
     RECHERCHE / FEED
  ========================== */
  getActiveVitrines: async (limit = 20, startAfter = null) => {
    let query = { isActive: true };

    // Firestore pagination startAfter works on a document snapshot.
    // For MongoDB, if startAfter is an ID, we assume we want items created before that date or after that ID.
    // Given the original code used createdAt desc, we'll try to find the startAfter doc first.

    let findQuery = VitrinesModel.getCollection()
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    if (startAfter) {
      const cursorDoc = await VitrinesModel.getCollection().findOne({ _id: startAfter });
      if (cursorDoc) {
        // Find documents with createdAt < cursorDoc.createdAt (since it's desc)
        // or matches createdAt but has an ID < cursorDoc._id for stable sorting.
        findQuery = VitrinesModel.getCollection()
          .find({
            ...query,
            $or: [
              { createdAt: { $lt: cursorDoc.createdAt } },
              { createdAt: cursorDoc.createdAt, _id: { $lt: cursorDoc._id } }
            ]
          })
          .sort({ createdAt: -1 })
          .limit(limit);
      }
    }

    const results = await findQuery.toArray();

    return {
      vitrines: results,
      hasMore: results.length === limit
    };
  },

  /* =========================
     UNICITE
  ========================== */
  isSlugUnique: async (slug) => {
    const count = await VitrinesModel.getCollection().countDocuments({ slug: slug }, { limit: 1 });
    return count === 0;
  },

  /* @deprecated Use isSlugUnique instead */
  isSlogUnique: async (slug) => {
    return await VitrinesModel.isSlugUnique(slug);
  },

  isVitrineIdUnique: async (vitrineId) => {
    const count = await VitrinesModel.getCollection().countDocuments({ _id: vitrineId }, { limit: 1 });
    return count === 0;
  },

  /* =========================
     UPDATE
  ========================== */
  updateBySlug: async (slug, updates) => {
    const result = await VitrinesModel.getCollection().findOneAndUpdate(
      { slug: slug },
      {
        $set: {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after' }
    );

    return result ? result : null;
  },

  update: async (slug, updates) => {
    return await VitrinesModel.updateBySlug(slug, updates);
  },

  /* =========================
     DELETE
  ========================== */
  deleteBySlug: async (slug) => {
    const doc = await VitrinesModel.findBySlug(slug);
    if (!doc) return null;

    await VitrinesModel.getCollection().deleteOne({ slug: slug });
    return doc;
  },

  /* =========================
     DATA MANAGEMENT
  ========================== */
  deleteAllByOwnerId: async (ownerId) => {
    await VitrinesModel.getCollection().deleteMany({ ownerId: ownerId });
  }
};

module.exports = VitrinesModel;
