// controllers/annonceControllers/createAnnonceController.js (AMÉLIORÉ)

const createAnnonceService = require('../../services/annonceServices/createAnnonceService');

// Si vous exportez l'erreur du service pour une meilleure gestion:
// const { UniqueConstraintError } = require('../../services/annonceServices/createAnnonceService');

const createAnnonceController = async (req, res) => {
    try {
        // Validation des données primaires
        const userId = req.user.userId;
        const { vitrineSlug, title, description, price, locations, currency } = req.body;

        // Gestion des images (Multer)
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => {
                // Construction de l'URL de l'image (adapter selon votre config serveur)
                // Idéalement, utilisez une variable d'env pour l'hôte
                return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            });
        } else if (req.body.images && Array.isArray(req.body.images)) {
            // Fallback pour compatibilité JSON (si images envoyées en base64 ou URL directes)
            images = req.body.images;
        }

        // --- CORRECTION: Locations est une simple chaîne de caractères ---
        // frontend envoie "Paris, Lyon" (ou via FormData)
        // On ne force plus la conversion en tableau.
        let parsedLocations = locations || '';
        if (typeof locations !== 'string') {
            // Si jamais on reçoit autre chose (ex: null), on assure une string
            parsedLocations = '';
        }
        // ----------------------------------------------------------------

        if (!vitrineSlug) {
            return res.status(400).json({ success: false, message: "Le slug de la vitrine est requis pour créer une annonce." });
        }
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Le titre de l'annonce est obligatoire et doit être non vide." });
        }
        // Note: images are optional (frontend may send none). Proceed even if images is empty.

        // Appel du service
        const annonce = await createAnnonceService({
            userId,
            vitrineSlug,
            title,
            description,
            price: parseFloat(price), // Assurer que le prix est un nombre
            images,
            locations: parsedLocations,
            currency
        });

        // Succès
        return res.status(201).json({ success: true, annonce });
    } catch (error) {
        console.error("Erreur lors de la création de l'annonce:", error.message, error.stack);

        // --- Gestion des erreurs plus précises ---

        // 1. Erreurs de contrainte d'unicité (lancées par le Service)
        if (error.name === 'UniqueConstraintError') {
            // Utilisation du statusCode 409 défini dans l'erreur personnalisée du service.
            return res.status(error.statusCode || 409).json({
                success: false,
                message: error.message
            });
        }

        // 2. Erreurs d'autorisation/propriété (lancées par verifyVitrineOwnership)
        // verifyVitrineOwnership devrait idéalement lancer une erreur spécifique avec un statut 403 ou 404
        // Ici, on gère les erreurs métier lancées par le service comme des 400 ou 403 par défaut.
        if (error.message.includes('propriété') || error.message.includes('trouver')) {
            // Si le service ne trouve pas la vitrine ou l'utilisateur n'est pas le propriétaire
            return res.status(403).json({ success: false, message: error.message });
        }

        // 3. Toutes les autres erreurs (erreurs de validation métier restantes, erreurs BD non gérées, etc.)
        // On reste sur le statut 400 (Bad Request) pour les erreurs de validation métier.
        return res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = createAnnonceController;