// controllers/annonceControllers/searchController.js
const searchService = require('../../services/annonceServices/searchService');

/**
 * Controller pour rechercher des annonces et des vitrines
 * @route GET /search
 * @query {string} q - Terme de recherche (requis)
 * @query {string} type - Type de recherche: annonces, vitrines, all (optionnel, défaut: all)
 * @query {number} page - Numéro de page (optionnel, défaut: 1)
 * @query {number} limit - Nombre de résultats par page (optionnel, défaut: 20)
 */
const searchController = async (req, res) => {
    try {
        const { q, type, page, limit } = req.query;

        // Validation du terme de recherche
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Le paramètre de recherche "q" est requis'
            });
        }

        // Préparation des paramètres
        const searchParams = {
            query: q,
            type: type || 'all',
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        };

        // Validation du type
        if (!['annonces', 'vitrines', 'all'].includes(searchParams.type)) {
            return res.status(400).json({
                success: false,
                message: 'Le type doit être: annonces, vitrines ou all'
            });
        }

        // Validation de la pagination
        if (searchParams.page < 1) {
            return res.status(400).json({
                success: false,
                message: 'Le numéro de page doit être supérieur à 0'
            });
        }

        if (searchParams.limit < 1 || searchParams.limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'La limite doit être entre 1 et 100'
            });
        }

        // Appel du service de recherche
        const result = await searchService(searchParams);

        res.status(200).json(result);
    } catch (error) {
        console.error('Erreur dans searchController:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la recherche'
        });
    }
};

module.exports = searchController;
