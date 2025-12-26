// services/vitrineServices/getAllVitrinesService.js
const VitrinesModel = require('../../models/vitrine-model');

/**
 * Service pour récupérer toutes les vitrines (public) avec filtrage et pagination.
 * @param {Object} filters - Filtres de recherche
 * @param {string} filters.category - Catégorie (type) à filtrer
 * @param {string} filters.search - Terme de recherche dans le nom ou la description
 * @param {number} filters.page - Numéro de page (défaut: 1)
 * @param {number} filters.limit - Nombre d'éléments par page (défaut: 6)
 * @returns {Object} { vitrines: Array, total: number, page: number, hasMore: boolean }
 */
const getAllVitrinesService = async (filters = {}) => {
    const { category, search, page = 1, limit = 6 } = filters;

    try {
        // Récupérer toutes les vitrines
        const allVitrines = await VitrinesModel.getAll();

        // Filtrer par catégorie (type)
        let filteredVitrines = allVitrines;
        if (category && category !== 'all') {
            filteredVitrines = filteredVitrines.filter(
                vitrine => vitrine.type && vitrine.type.toLowerCase() === category.toLowerCase()
            );
        }

        // Filtrer par recherche (nom ou description)
        if (search && search.trim()) {
            const searchLower = search.toLowerCase().trim();
            filteredVitrines = filteredVitrines.filter(vitrine => {
                const nameMatch = vitrine.name && vitrine.name.toLowerCase().includes(searchLower);
                const descMatch = vitrine.description && vitrine.description.toLowerCase().includes(searchLower);
                return nameMatch || descMatch;
            });
        }

        // Calculer la pagination
        const total = filteredVitrines.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedVitrines = filteredVitrines.slice(startIndex, endIndex);

        // Nettoyer les données (supprimer _id)
        const cleanedVitrines = paginatedVitrines.map(vitrine => {
            const cleaned = vitrine.toObject ? vitrine.toObject() : { ...vitrine };
            delete cleaned._id;
            return cleaned;
        });

        return {
            vitrines: cleanedVitrines,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: endIndex < total
        };

    } catch (dbError) {
        console.error("Erreur DB getAllVitrinesService:", dbError);
        throw new Error("Échec de la récupération des vitrines en base de données.");
    }
};

module.exports = getAllVitrinesService;
