/**
 * Configuration pour le stockage des images (Cloudinary)
 */
module.exports = {
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },
    // Dossier racine pour l'application dans Cloudinary
    rootFolder: 'my_app'
};
