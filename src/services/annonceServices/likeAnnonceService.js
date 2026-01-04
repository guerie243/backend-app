const AnnonceModel = require('../../models/annonceModel');

const likeAnnonceService = async (slug) => {
    console.log(`--> [Service] likeAnnonceService called for slug: ${slug}`);

    // Vérifier que l'annonce existe
    const annonce = await AnnonceModel.findBySlug(slug);
    if (!annonce) {
        throw new Error('Annonce non trouvée');
    }

    // Incrémenter le compteur de likes
    const updatedAnnonce = await AnnonceModel.incrementLikes(slug);

    if (!updatedAnnonce) {
        throw new Error('Erreur lors de la mise à jour du compteur de likes');
    }

    console.log(`--> [Service] Likes incremented for ${slug}. New count: ${updatedAnnonce.likes_count || 0}`);
    return updatedAnnonce;
};

module.exports = likeAnnonceService;
