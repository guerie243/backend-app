const { getDb } = require('../../config/db');

const COLLECTION = 'Annonces';

const getFeedService = async ({
    page = 1,
    limit = 20,
    categorieId = null,
    recherche = null
} = {}) => {
    try {
        const db = getDb();
        const collection = db.collection(COLLECTION);

        let query = {};

        // Filtrage par catégorie
        if (categorieId) {
            // Utilisation d'une regex insensible à la casse pour correspondre au comportement précédent
            query.vitrineCategory = { $regex: `^${categorieId}$`, $options: 'i' };
        }

        // Filtrage par recherche
        if (recherche) {
            const searchLower = recherche.trim();
            query.$or = [
                { title: { $regex: searchLower, $options: 'i' } },
                { description: { $regex: searchLower, $options: 'i' } },
                { locations: { $elemMatch: { $regex: searchLower, $options: 'i' } } }
            ];
        }

        const total = await collection.countDocuments(query);
        const skip = (page - 1) * limit;

        const annonces = await collection
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        // On remap _id vers id pour garder la compatibilité frontend si nécessaire
        const mappedAnnonces = annonces.map(a => ({ id: a._id, ...a }));

        return {
            success: true,
            data: mappedAnnonces,
            pagination: {
                total,
                page,
                limit,
                hasNextPage: (skip + annonces.length) < total
            }
        };
    } catch (error) {
        console.error("Erreur getFeedService:", error);
        return { success: false, message: "Erreur lors de la récupération du flux." };
    }
};

module.exports = getFeedService;
