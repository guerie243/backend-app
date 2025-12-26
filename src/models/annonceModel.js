const admin = require('firebase-admin');
const { FIREBASE_SERVICE_ACCOUNT } = require('../config/config');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT))
  });
}

const db = admin.firestore();
const COLLECTION = 'Annonces';

const AnnonceModel = {

  /* =========================
     CREATE
  ========================== */
  create: async (annonce) => {
    await db.collection(COLLECTION).doc(annonce.annonceId).set({
      ...annonce,
      annonceId: annonce.annonceId // ⚠️ ID aussi dans les champs
    });
    return annonce;
  },

  /* =========================
     UPDATE
  ========================== */
  update: async (slug, updates) => {
    const snap = await db.collection(COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snap.empty) return null;

    const docRef = snap.docs[0].ref;

    await docRef.update({
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return (await docRef.get()).data();
  },

  /* =========================
     DELETE
  ========================== */
  delete: async (slug) => {
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
     FIND ONE
  ========================== */
  findBySlug: async (slug) => {
    const snap = await db.collection(COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    return snap.empty ? null : snap.docs[0].data();
  },

  /* =========================
     FEED GLOBAL (PAGINATION CURSOR)
     → Page d’accueil
  ========================== */
  getFeed: async ({ limit = 10, cursor = null }) => {
    let query = db.collection(COLLECTION)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (cursor) {
      const cursorDoc = await db.collection(COLLECTION).doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snap = await query.get();

    return {
      data: snap.docs.map(d => d.data()),
      nextCursor: snap.docs.length ? snap.docs[snap.docs.length - 1].id : null
    };
  },

  /* =========================
     FEED PAR VITRINE
     (pagination optimisée)
  ========================== */
  getByVitrineSlug: async ({ vitrineSlug, limit = 10, cursor = null }) => {
    let query = db.collection(COLLECTION)
      .where('vitrineSlug', '==', vitrineSlug)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (cursor) {
      const cursorDoc = await db.collection(COLLECTION).doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snap = await query.get();

    return {
      data: snap.docs.map(d => d.data()),
      nextCursor: snap.docs.length ? snap.docs[snap.docs.length - 1].id : null
    };
  },

  /* =========================
     RECHERCHE
     (title + description)
  ========================== */
  search: async ({ queryText, limit = 10, cursor = null }) => {
    // Firestore ne supporte pas LIKE
    // 👉 On prépare pour recherche frontend / index externe plus tard

    let query = db.collection(COLLECTION)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (cursor) {
      const cursorDoc = await db.collection(COLLECTION).doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snap = await query.get();

    const filtered = snap.docs
      .map(d => d.data())
      .filter(a =>
        a.title.toLowerCase().includes(queryText.toLowerCase()) ||
        a.description.toLowerCase().includes(queryText.toLowerCase())
      );

    return {
      data: filtered,
      nextCursor: snap.docs.length ? snap.docs[snap.docs.length - 1].id : null
    };
  },

  /* =========================
     UNIQUENESS
  ========================== */
  isSlugUnique: async (slug) => {
    const snap = await db.collection(COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get();
    return snap.empty;
  },

  isAnnonceIdUnique: async (annonceId) => {
    const doc = await db.collection(COLLECTION).doc(annonceId).get();
    return !doc.exists;
  },

  /* =========================
     DELETE OWNER DATA
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

module.exports = AnnonceModel;
