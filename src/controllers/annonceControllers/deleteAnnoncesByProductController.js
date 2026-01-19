const AnnonceModel = require('../../models/annonceModel');
const { invalidateAnnoncesCache } = require('../../utils/cache');

/**
 * Supprime toutes les annonces liées à un productId spécifique
 * (Appelé par le Module 2 lors de la suppression d'un produit)
 */
const deleteAnnoncesByProductController = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ success: false, message: "productId est requis." });
        }

        console.log(`[syncM1] Suppression des annonces pour le produit: ${productId}`);

        // Suppression groupée dans MongoDB
        const result = await AnnonceModel.getCollection().deleteMany({ productId: productId });

        // 🔔 Invalidation du cache des annonces
        invalidateAnnoncesCache();

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} annonce(s) supprimée(s).`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error("Erreur suppression synchro Module 1 (byProduct):", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = deleteAnnoncesByProductController;
