const getVitrineByIdService = require('../../services/vitrineServices/getVitrineByIdService');

/**
 * @desc    Récupérer une vitrine par son ID
 * @route   GET /api/vitrines/:vitrineId
 * @access  Public
 */
const getVitrineByIdController = async (req, res) => {
    try {
        const { vitrineId } = req.params;

        const vitrine = await getVitrineByIdService(vitrineId);

        res.status(200).json({
            success: true,
            vitrine
        });
    } catch (error) {
        console.error('Error fetching vitrine by ID:', error);

        if (error.message === "Vitrine non trouvée") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = getVitrineByIdController;
