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

        // --- SANITIZATION ADDED ---
        // Clean req.body of any "empty object" strings or objects that might have slipped through
        const imageFields = ['logo', 'coverImage', 'banner', 'avatar'];
        imageFields.forEach(field => {
            if (req.body[field]) {
                const val = req.body[field];
                // Remove if it is literally "{}" or "[object Object]" or an empty object
                if (val === "{}" || val === "[object Object]" || (typeof val === 'object' && Object.keys(val).length === 0)) {
                    console.warn(`[imageUploadInterceptor] Removed garbage value for field '${field}':`, val);
                    delete req.body[field];
                }
            }
        });
        // --------------------------

        try {
            // Cas 1: req.files est un Tableau (upload.array)
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                const urls = await Promise.all(req.files.map(file => imageStorage.upload(file, folder)));
                const validUrls = urls.filter(Boolean);

                // Filtrer les URIs locales
                let existingImages = req.body.images;
                if (typeof existingImages === 'string') {
                    try { existingImages = JSON.parse(existingImages); } catch (e) { existingImages = [existingImages]; }
                }

                if (Array.isArray(existingImages)) {
                    existingImages = existingImages.filter(img =>
                        typeof img === 'string' &&
                        !img.startsWith('file://') && !img.startsWith('content://') &&
                        !img.startsWith('blob:') && !img.startsWith('data:')
                    );
                } else {
                    existingImages = [];
                }

                req.body.images = existingImages.concat(validUrls);
            }
            // Cas 2: req.files est un Objet (upload.fields) - ex: { logo: [...], coverImage: [...] }
            else if (req.files && typeof req.files === 'object') {
                const fields = Object.keys(req.files);
                for (const field of fields) {
                    const files = req.files[field];
                    if (files && files.length > 0) {
                        const file = files[0];
                        const url = await imageStorage.upload(file, folder);
                        if (url) {
                            req.body[field] = url;
                        }
                    } else {
                        // Si pas de nouveau fichier mais une URI locale est présente dans le body, on la retire
                        const bodyValue = req.body[field];
                        if (typeof bodyValue === 'string' && (
                            bodyValue.startsWith('file://') || bodyValue.startsWith('content://') ||
                            bodyValue.startsWith('blob:') || bodyValue.startsWith('data:')
                        )) {
                            delete req.body[field];
                        }
                    }
                }
            }
            // Cas 3: req.file est unique (upload.single)
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
