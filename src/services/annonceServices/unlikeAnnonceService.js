const AnnonceModel = require('../../models/annonceModel');

const unlikeAnnonceService = async (slug) => {
    console.log(`--> [Service] unlikeAnnonceService called for slug: ${slug}`);

    // Vérifier que l'annonce existe
    const annonce = await AnnonceModel.findBySlug(slug);
    if (!annonce) {
        throw new Error('Annonce non trouvée');
    }

    // Décrémenter le compteur de likes (avec protection min = 0)
    const updatedAnnonce = await AnnonceModel.decrementLikes(slug);

    if (!updatedAnnonce) {
        throw new Error('Erreur lors de la mise à jour du compteur de likes');
    }

    console.log(`--> [Service] Likes decremented for ${slug}. New count: ${updatedAnnonce.likes_count || 0}`);
    return updatedAnnonce;
};

module.exports = unlikeAnnonceService;
