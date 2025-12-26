// controllers/annonceControllers/getFeedController.js
const getFeedService = require('../../services/annonceServices/getFeedService');

/**
 * Controller pour récupérer le feed d'annonces
 * @route GET /annonces/feed
 * @query {number} page - Numéro de page (optionnel, défaut: 1)
 * @query {number} limit - Nombre d'annonces par page (optionnel, défaut: 20)
 * @query {string} sortBy - Champ de tri: createdAt, price, title (optionnel, défaut: createdAt)
 * @query {string} order - Ordre de tri: asc, desc (optionnel, défaut: desc)
 * @query {string} categorieId - Slug de la catégorie pour filtrer (optionnel)
 * @query {string} recherche - Texte de recherche dans titre, description, lieux (optionnel)
 */
const getFeedController = async (req, res) => {
    try {
        const { page, limit, sortBy, order, categorieId, recherche } = req.query;

        // Conversion et validation des paramètres
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sortBy: sortBy || 'createdAt',
            order: order || 'desc',
            categorieId: categorieId || null,
            recherche: recherche || null
        };

        // Validation des valeurs
        if (options.page < 1) {
            return res.status(400).json({
                success: false,
                message: 'Le numéro de page doit être supérieur à 0'
            });
        }

        if (options.limit < 1 || options.limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'La limite doit être entre 1 et 100'
            });
        }

        if (!['createdAt', 'price', 'title'].includes(options.sortBy)) {
            return res.status(400).json({
                success: false,
                message: 'Le champ de tri doit être: createdAt, price ou title'
            });
        }

        if (!['asc', 'desc'].includes(options.order)) {
            return res.status(400).json({
                success: false,
                message: "L'ordre de tri doit être: asc ou desc"
            });
        }

        // Appel du service
        const result = await getFeedService(options);

        res.status(200).json(result);
    } catch (error) {
        console.error('Erreur dans getFeedController:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération du feed'
        });
    }
};

module.exports = getFeedController;
