const admin = require('firebase-admin');
const { FIREBASE_SERVICE_ACCOUNT } = require('../config/config');

if (!admin.apps.length && FIREBASE_SERVICE_ACCOUNT) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT))
    });
  } catch (err) {
    console.error("Firebase initialization error in vitrine-model:", err.message);
  }
}

const db = admin.firestore();
const COLLECTION = 'Vitrines';

const VitrinesModel = {

  /* =========================
     CREATION
  ========================== */
  create: async (vitrine) => {
    await db.collection(COLLECTION)
      .doc(vitrine.vitrineId)
      .set(vitrine);
    return vitrine;
  },

  /* =========================
     LECTURE
  ========================== */
  findBySlug: async (slug) => {
    const snap = await db.collection(COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    return snap.empty ? null : snap.docs[0].data();
  },

  /* @deprecated Use findBySlug instead */
  findBySlog: async (slug) => {
    return await VitrinesModel.findBySlug(slug);
  },

  findByVitrineId: async (vitrineId) => {
    const doc = await db.collection(COLLECTION)
      .doc(vitrineId)
      .get();

    return doc.exists ? doc.data() : null;
  },

  getByOwnerId: async (ownerId) => {
    const snap = await db.collection(COLLECTION)
      .where('ownerId', '==', ownerId)
      .get();

    return snap.docs.map(d => d.data());
  },

  getAll: async () => {
    const snap = await db.collection(COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();

    return snap.docs.map(d => d.data());
  },

  /* =========================
     RECHERCHE / FEED
  ========================== */
  getActiveVitrines: async (limit = 20, startAfter = null) => {
    let query = db.collection(COLLECTION)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (startAfter) {
      const cursorDoc = await db.collection(COLLECTION)
        .doc(startAfter)
        .get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snap = await query.get();
    return {
      vitrines: snap.docs.map(d => d.data()),
      hasMore: snap.docs.length === limit
    };
  },

  /* =========================
     UNICITE
  ========================== */
  isSlugUnique: async (slug) => {
    const snap = await db.collection(COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    return snap.empty;
  },

  /* @deprecated Use isSlugUnique instead */
  isSlogUnique: async (slug) => {
    return await VitrinesModel.isSlugUnique(slug);
  },

  isVitrineIdUnique: async (vitrineId) => {
    const doc = await db.collection(COLLECTION)
      .doc(vitrineId)
      .get();

    return !doc.exists;
  },

  /* =========================
     UPDATE
  ========================== */
  updateBySlug: async (slug, updates) => {
    const snap = await db.collection(COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snap.empty) return null;

    const ref = snap.docs[0].ref;
    await ref.update({
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return (await ref.get()).data();
  },

  update: async (slug, updates) => {
    return await VitrinesModel.updateBySlug(slug, updates);
  },

  /* =========================
     DELETE
  ========================== */
  deleteBySlug: async (slug) => {
    const snap = await db.collection(COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snap.empty) return null;

    const data = snap.docs[0].data();
    await snap.docs[0].ref.delete();
    return data;
  },

  /* =========================
     DATA MANAGEMENT
  ========================== */
  deleteAllByOwnerId: async (ownerId) => {
    const snap = await db.collection(COLLECTION)
      .where('ownerId', '==', ownerId)
      .get();

    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
};

module.exports = VitrinesModel;
