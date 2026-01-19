const AnnonceModel = require('../../models/annonceModel');
const { invalidateAnnoncesCache } = require('../../utils/cache');

/**
 * Met à jour toutes les annonces liées à un productId spécifique
 * (Appelé par le Module 2 lors de la modification d'un produit)
 */
const updateAnnoncesByProductController = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "productId est requis." });
        }

        // On ne met à jour que les champs autorisés par la synchro
        const allowedUpdates = ['price', 'category', 'locations', 'title', 'description', 'deliveryFee'];
        const filteredUpdates = {};

        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        });

        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({ success: false, message: "Aucune donnée de synchronisation valide." });
        }

        console.log(`[syncM1] Mise à jour des annonces pour le produit: ${productId}`);

        // Mise à jour groupée dans MongoDB
        const result = await AnnonceModel.getCollection().updateMany(
            { productId: productId },
            { $set: { ...filteredUpdates, updatedAt: new Date().toISOString() } }
        );

        // 🔔 Invalidation du cache des annonces
        invalidateAnnoncesCache();

        return res.status(200).json({
            success: true,
            message: `${result.modifiedCount} annonce(s) mise(s) à jour.`,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error("Erreur synchro Module 1 (byProduct):", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = updateAnnoncesByProductController;
