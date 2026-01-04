const { getDb } = require('../config/db');

const COLLECTION = 'Annonces';

const AnnonceModel = {

  getCollection: () => {
    return getDb().collection(COLLECTION);
  },

  /* =========================
     CREATE
  ========================== */
  create: async (annonce) => {
    const data = { ...annonce, _id: annonce.annonceId };
    await AnnonceModel.getCollection().insertOne(data);
    return annonce;
  },

  /* =========================
     UPDATE
  ========================== */
  update: async (slug, updates) => {
    const result = await AnnonceModel.getCollection().findOneAndUpdate(
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

  /* =========================
     DELETE
  ========================== */
  delete: async (slug) => {
    const doc = await AnnonceModel.findBySlug(slug);
    if (!doc) return null;

    await AnnonceModel.getCollection().deleteOne({ slug: slug });
    return doc;
  },

  /* =========================
     FIND ONE
  ========================== */
  findBySlug: async (slug) => {
    return await AnnonceModel.getCollection().findOne({ slug: slug });
  },

  /* =========================
     FEED GLOBAL (PAGINATION CURSOR)
  ========================== */
  getFeed: async ({ limit = 10, cursor = null }) => {
    let query = {};
    if (cursor) {
      const cursorDoc = await AnnonceModel.getCollection().findOne({ _id: cursor });
      if (cursorDoc) {
        query = {
          $or: [
            { createdAt: { $lt: cursorDoc.createdAt } },
            { createdAt: cursorDoc.createdAt, _id: { $lt: cursorDoc._id } }
          ]
        };
      }
    }

    const results = await AnnonceModel.getCollection()
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return {
      data: results,
      nextCursor: results.length ? results[results.length - 1]._id : null
    };
  },

  /* =========================
     FEED PAR VITRINE (ID)
  ========================== */
  getByVitrineId: async ({ vitrineId, limit = 10, cursor = null }) => {
    let query = { vitrineId: vitrineId };

    if (cursor) {
      const cursorDoc = await AnnonceModel.getCollection().findOne({ _id: cursor });
      if (cursorDoc) {
        query = {
          ...query,
          $or: [
            { createdAt: { $lt: cursorDoc.createdAt } },
            { createdAt: cursorDoc.createdAt, _id: { $lt: cursorDoc._id } }
          ]
        };
      }
    }

    const results = await AnnonceModel.getCollection()
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return {
      data: results,
      nextCursor: results.length ? results[results.length - 1]._id : null
    };
  },

  /* =========================
     FEED PAR VITRINE (SLUG) - Maintain for compatibility
  ========================== */
  getByVitrineSlug: async ({ vitrineSlug, limit = 10, cursor = null }) => {
    let query = { vitrineSlug: vitrineSlug };

    if (cursor) {
      const cursorDoc = await AnnonceModel.getCollection().findOne({ _id: cursor });
      if (cursorDoc) {
        query = {
          ...query,
          $or: [
            { createdAt: { $lt: cursorDoc.createdAt } },
            { createdAt: cursorDoc.createdAt, _id: { $lt: cursorDoc._id } }
          ]
        };
      }
    }

    const results = await AnnonceModel.getCollection()
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return {
      data: results,
      nextCursor: results.length ? results[results.length - 1]._id : null
    };
  },

  /* =========================
     RECHERCHE
  ========================== */
  search: async ({ queryText, limit = 10, cursor = null }) => {
    // MongoDB supporte nativement le $regex
    let query = {
      $or: [
        { title: { $regex: queryText, $options: 'i' } },
        { description: { $regex: queryText, $options: 'i' } }
      ]
    };

    if (cursor) {
      const cursorDoc = await AnnonceModel.getCollection().findOne({ _id: cursor });
      if (cursorDoc) {
        query = {
          ...query,
          $and: [
            {
              $or: [
                { createdAt: { $lt: cursorDoc.createdAt } },
                { createdAt: cursorDoc.createdAt, _id: { $lt: cursorDoc._id } }
              ]
            }
          ]
        };
      }
    }

    const results = await AnnonceModel.getCollection()
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return {
      data: results,
      nextCursor: results.length ? results[results.length - 1]._id : null
    };
  },

  /* =========================
     UNIQUENESS
  ========================== */
  isSlugUnique: async (slug) => {
    const count = await AnnonceModel.getCollection().countDocuments({ slug: slug }, { limit: 1 });
    return count === 0;
  },

  isAnnonceIdUnique: async (annonceId) => {
    const count = await AnnonceModel.getCollection().countDocuments({ _id: annonceId }, { limit: 1 });
    return count === 0;
  },

  /* =========================
     DELETE OWNER DATA
  ========================== */
  deleteAllByOwnerId: async (ownerId) => {
    await AnnonceModel.getCollection().deleteMany({ ownerId: ownerId });
  },

  /* =========================
     LIKES MANAGEMENT
  ========================== */
  incrementLikes: async (slug) => {
    const result = await AnnonceModel.getCollection().findOneAndUpdate(
      { slug: slug },
      {
        $inc: { likes_count: 1 },
        $set: { updatedAt: new Date().toISOString() }
      },
      { returnDocument: 'after' }
    );
    return result ? result : null;
  },

  decrementLikes: async (slug) => {
    // First, get the current document to check likes_count
    const doc = await AnnonceModel.findBySlug(slug);
    if (!doc) return null;

    // Only decrement if likes_count > 0
    if ((doc.likes_count || 0) > 0) {
      const result = await AnnonceModel.getCollection().findOneAndUpdate(
        { slug: slug },
        {
          $inc: { likes_count: -1 },
          $set: { updatedAt: new Date().toISOString() }
        },
        { returnDocument: 'after' }
      );
      return result ? result : null;
    }

    // If already 0, just return the document as is
    return doc;
  }
};

module.exports = AnnonceModel;
