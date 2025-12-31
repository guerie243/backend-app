const imageStorage = require('../utils/imageStorage');

/**
 * Middleware qui intercepte les fichiers de Multer et les upload
 * vers Cloudinary. Si le stockage est indisponible, il continue
 * le traitement sans les images.
 */
const imageUploadInterceptor = (folder = 'annonces') => {
    return async (req, res, next) => {
        // Si le stockage n'est pas disponible, on prépare une alerte 
        // mais on laisse la requête continuer pour le reste des données.
        if (!imageStorage.isAvailable()) {
            console.warn("[imageUploadInterceptor] Stockage indisponible.");
            req.imageWarning = "Le traitement d'image est temporairement indisponible.";

            // On nettoie quand même les fichiers temporaires créés par Multer
            const fs = require('fs').promises;
            const cleanup = (f) => f && f.path && fs.unlink(f.path).catch(() => { });
            if (req.files) req.files.forEach(cleanup);
            if (req.file) cleanup(req.file);

            return next();
        }

        try {
            if (req.files && req.files.length > 0) {
                const urls = await Promise.all(req.files.map(file => imageStorage.upload(file, folder)));
                // Filtre les URLs nulles en cas d'échec partiel
                req.body.images = (req.body.images || []).concat(urls.filter(Boolean));
            }
            else if (req.file) {
                const url = await imageStorage.upload(req.file, folder);
                if (url) {
                    req.body.images = [url];
                    if (req.file.fieldname) req.body[req.file.fieldname] = url;
                }
            }
            next();
        } catch (error) {
            console.error('Erreur Intercepteur Image:', error);
            // On n'arrête pas la requête, on laisse les données textuelles être sauvées
            req.imageWarning = "Une erreur est survenue lors du traitement des images.";
            next();
        }
    };
};

module.exports = imageUploadInterceptor;
