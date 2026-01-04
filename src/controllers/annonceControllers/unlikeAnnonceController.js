const unlikeAnnonceService = require('../../services/annonceServices/unlikeAnnonceService');

const unlikeAnnonceController = async (req, res) => {
    console.log("--> [Controller] unlikeAnnonceController HIT");
    const { slug } = req.params;

    try {
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Le slug est requis."
            });
        }

        console.log(`--> [Controller] Removing like from slug: ${slug}`);
        const annonce = await unlikeAnnonceService(slug);

        return res.status(200).json({
            success: true,
            annonce,
            message: "Like retiré avec succès"
        });

    } catch (error) {
        console.error("--> [Controller] ERROR:", error);

        if (error.message === 'Annonce non trouvée') {
            return res.status(404).json({
                success: false,
                message: "Annonce non trouvée."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Erreur serveur lors du retrait du like.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = unlikeAnnonceController;
