const getVitrineBySlugService = require('../../services/vitrineServices/getVitrineBySlogService');

const getVitrineBySlugController = async (req, res) => {
    const { slug } = req.params;

    try {
        const vitrine = await getVitrineBySlugService(slug);

        if (!vitrine) {
            return res.status(404).json({
                success: false,
                message: "Vitrine non trouvée."
            });
        }

        return res.status(200).json({
            success: true,
            vitrine
        });

    } catch (error) {
        console.error("Erreur controller getVitrineBySlug:", error);
        return res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération de la vitrine.",
            error: error.message
        });
    }
};

module.exports = getVitrineBySlugController;