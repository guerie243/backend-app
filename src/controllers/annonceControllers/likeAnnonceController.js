const likeAnnonceService = require('../../services/annonceServices/likeAnnonceService');

const likeAnnonceController = async (req, res) => {
    console.log("--> [Controller] likeAnnonceController HIT");
    const { slug } = req.params;

    try {
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Le slug est requis."
            });
        }

        console.log(`--> [Controller] Adding like to slug: ${slug}`);
        const annonce = await likeAnnonceService(slug);

        return res.status(200).json({
            success: true,
            annonce,
            message: "Like ajouté avec succès"
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
            message: "Erreur serveur lors de l'ajout du like.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = likeAnnonceController;
