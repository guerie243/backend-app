const AnnonceModel = require('../../models/annonceModel');
const { verifyVitrineOwnership } = require('../../utils/vitrineCheckUtils');
const { generateUniqueAnnonceId, generateUniqueAnnonceSlug } = require('../../utils/annonceUtils');

/**
 * Nettoyage et découpage du texte pour la recherche Firestore
 */
const buildSearchKeywords = (text = '') => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // supprime caractères spéciaux
        .split(/\s+/)
        .filter(word => word.length >= 2);
};

const createAnnonceService = async ({
    userId,
    vitrineSlug,
    title,
    description,
    price,
    images,
    locations,
    currency
}) => {

    // 🔒 Vérification propriété vitrine
    const { ownerId, vitrineId, vitrineCategory } = await verifyVitrineOwnership(userId, vitrineSlug);

    // 🔑 IDs uniques
    const annonceId = await generateUniqueAnnonceId(id =>
        AnnonceModel.isAnnonceIdUnique(id)
    );

    const slug = await generateUniqueAnnonceSlug(title, s =>
        AnnonceModel.isSlugUnique(s)
    );

    const now = new Date().toISOString();

    // 🔍 Préparation recherche Firestore
    const titleLower = title.toLowerCase();
    const descriptionLower = (description ?? '').toLowerCase();

    const searchKeywords = Array.from(new Set([
        ...buildSearchKeywords(title),
        ...buildSearchKeywords(description)
    ]));

    const annonce = {
        annonceId,
        ownerId,
        vitrineId,
        vitrineSlug,
        slug,

        // Champs principaux
        title,
        description: description ?? '',
        price: price ?? null,
        currency: currency ?? 'USD',
        vitrineCategory: vitrineCategory || 'general',
        images: Array.isArray(images) ? images : [],
        locations: typeof locations === 'string'
            ? locations.split(',').map(l => l.trim()).filter(Boolean)
            : (Array.isArray(locations) ? locations : []),

        // 🔍 Champs Firestore Search
        titleLower,
        descriptionLower,
        searchKeywords,

        // Meta
        createdAt: now,
        updatedAt: now
    };

    return AnnonceModel.create(annonce);
};

module.exports = createAnnonceService;
