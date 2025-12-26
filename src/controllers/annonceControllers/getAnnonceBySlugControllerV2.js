// controllers/annonceControllers/getAnnonceBySlugControllerV2.js
const serviceModule = require('../../services/annonceServices/getAnnonceBySlugService');
const getAnnonceBySlugService = serviceModule.getAnnonceBySlugService;

const getAnnonceBySlugController = async (req, res) => {
    console.log("--> Controller V2: getAnnonceBySlug HIT");
    try {
        const slug = req.params.slug;
        console.log("--> Slug requested:", slug);

        console.log("--> Calling service...");
        const annonce = await getAnnonceBySlugService(slug);
        console.log("--> Service returned:", annonce);

        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: "Annonce non trouvée"
            });
        }

        // Succès
        return res.status(200).json({ success: true, annonce });

    } catch (error) {
        console.error("Erreur FULL V2:", error);
        return res.status(500).json({
            success: false,
            message: "Erreur serveur (V2): " + error.message,
            stack: error.stack
        });
    }
};

module.exports = getAnnonceBySlugController;
