// controllers/vitrineControllers/getAllVitrinesController.js
const getAllVitrinesService = require('../../services/vitrineServices/getAllVitrinesService');

/**
 * Controller pour récupérer toutes les vitrines (public) avec filtrage et pagination.
 * Query params: category, search, page, limit
 */
const getAllVitrinesController = async (req, res) => {
    try {
        const { category, search, page, limit } = req.query;

        const result = await getAllVitrinesService({
            category,
            search,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 6
        });

        return res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error("Erreur getAllVitrinesController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Erreur lors de la récupération des vitrines."
        });
    }
};

module.exports = getAllVitrinesController;
