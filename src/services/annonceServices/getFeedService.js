const admin = require('firebase-admin');
const db = admin.firestore();

const COLLECTION = 'Annonces';

const getFeedService = async ({
    page = 1,
    limit = 20,
    categorieId = null,
    recherche = null
} = {}) => {
    let query = db.collection(COLLECTION).orderBy('createdAt', 'desc');

    const snapshot = await query.get();
    let annonces = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (categorieId) {
        annonces = annonces.filter(a =>
            a.vitrineCategory && a.vitrineCategory.toLowerCase() === categorieId.toLowerCase()
        );
    }

    // Filtrage par recherche (côté serveur pour l'instant car Firestore ne supporte pas le LIKE)
    if (recherche) {
        const searchLower = recherche.toLowerCase().trim();
        annonces = annonces.filter(a =>
            (a.title && a.title.toLowerCase().includes(searchLower)) ||
            (a.description && a.description.toLowerCase().includes(searchLower)) ||
            (Array.isArray(a.locations) && a.locations.some(l => l.toLowerCase().includes(searchLower)))
        );
    }

    // Pagination manuelle pour le flux filtré
    const total = annonces.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedAnnonces = annonces.slice(start, end);

    return {
        success: true,
        data: paginatedAnnonces,
        pagination: {
            total,
            page,
            limit,
            hasNextPage: end < total
        }
    };
};

module.exports = getFeedService;
