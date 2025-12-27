// controllers/annonceControllers/getAnnoncesByVitrineController.js
const getAnnoncesByVitrineService = require('../../services/annonceServices/getAnnoncesByVitrineService');

const getAnnoncesByVitrineController = async (req, res) => {
    try {
        const vitrineSlug = req.params.vitrineSlug;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (!vitrineSlug) {
            return res.status(400).json({ success: false, message: "Le slug de la vitrine est requis." });
        }

        const annonces = await getAnnoncesByVitrineService(vitrineSlug, page, limit);

        return res.status(200).json({
            success: true,
            count: annonces.data ? annonces.data.length : 0,
            annonces: annonces.data || []
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des annonces de vitrine:", error);

        // Détection de l'index Firestore manquant
        if (error.code === 9 || (error.message && error.message.includes('requires an index'))) {
            console.error("🚨 FIRESTORE INDEX MISSING 🚨");
            return res.status(500).json({
                success: false,
                message: "Erreur de base de données : l'index requis n'est pas configuré. Veuillez contacter l'administrateur.",
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération des annonces.",
            error: error.message
        });
    }
};

module.exports = getAnnoncesByVitrineController;