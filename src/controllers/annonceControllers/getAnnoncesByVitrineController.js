// controllers/annonceControllers/getAnnoncesByVitrineController.js (AMÉLIORÉ)

const {
    getAnnoncesByVitrineService,
    InternalServerError,
    APIError
} = require('../../services/annonceServices/getAnnoncesByVitrineService');

const getAnnoncesByVitrineController = async (req, res) => {
    try {
        const vitrineSlug = req.params.vitrineSlug;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const annonces = await getAnnoncesByVitrineService(vitrineSlug, page, limit);

        // 200 OK est standard même si le tableau est vide (la requête a réussi)
        return res.status(200).json({
            success: true,
            count: annonces.length, // Ajout du compteur pour l'utilité
            annonces
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des annonces de vitrine:", error);

        // Check for Firestore Index requirement
        if (error.code === 9 || error.message.includes('requires an index')) {
            console.error("🚨 FIRESTORE INDEX MISSING 🚨");
            console.error("Please create the index using the link in the error above or in the Firebase Console.");
        }

        // --- Gestion des erreurs typées du Service ---

        // 500: Erreur interne
        if (error instanceof InternalServerError) {
            return res.status(500).json({ success: false, message: error.message });
        }

        // Autres APIError (400, etc.)
        if (error instanceof APIError) {
            return res.status(error.statusCode || 400).json({ success: false, message: error.message });
        }

        // Erreur inattendue
        return res.status(500).json({ success: false, message: "Erreur serveur inattendue." });
    }
};

module.exports = getAnnoncesByVitrineController;