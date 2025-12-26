const getAnnonceBySlugService = require('../../services/annonceServices/getAnnonceBySlugService');

const getAnnonceBySlugController = async (req, res) => {
    console.log("--> [Controller] getAnnonceBySlug HIT");
    const { slug } = req.params;

    try {
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Le slug est requis."
            });
        }

        console.log(`--> [Controller] Requesting slug: ${slug}`);
        const annonce = await getAnnonceBySlugService(slug);

        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: "Annonce non trouvée."
            });
        }

        return res.status(200).json({
            success: true,
            annonce
        });

    } catch (error) {
        console.error("--> [Controller] CRITICAL ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération de l'annonce.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = getAnnonceBySlugController;