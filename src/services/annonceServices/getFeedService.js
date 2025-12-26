const admin = require('firebase-admin');
const db = admin.firestore();

const COLLECTION = 'Annonces';

const getFeedService = async ({
    limit = 10,
    lastCreatedAt = null
} = {}) => {

    let query = db
        .collection(COLLECTION)
        .orderBy('createdAt', 'desc')
        .limit(limit);

    if (lastCreatedAt) {
        query = query.startAfter(lastCreatedAt);
    }

    const snapshot = await query.get();

    const annonces = snapshot.docs.map(doc => doc.data());

    const lastDoc =
        snapshot.docs.length > 0
            ? snapshot.docs[snapshot.docs.length - 1].get('createdAt')
            : null;

    return {
        success: true,
        data: annonces,
        pagination: {
            limit,
            lastCreatedAt: lastDoc,
            hasNextPage: annonces.length === limit
        }
    };
};

module.exports = getFeedService;
