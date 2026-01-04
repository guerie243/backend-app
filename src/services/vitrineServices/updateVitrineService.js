const VitrinesModel = require('../../models/vitrine-model');

const updateVitrineService = {
  updateVitrine: async (ownerId, slug, updateData) => {
    const vitrine = await VitrinesModel.findBySlug(slug);
    if (!vitrine) throw new Error(`Vitrine avec le slug ${slug} introuvable.`);
    if (vitrine.ownerId.toString() !== ownerId.toString()) {
      throw new Error("Vous n'avez pas la permission de modifier cette vitrine.");
    }

    if (updateData.vitrineId) throw new Error("Le vitrineId ne peut pas être modifié.");

    let newSlug = vitrine.slug;
    if (updateData.slug && updateData.slug !== vitrine.slug) {
      if (!updateData.slug.startsWith("@") || updateData.slug.length <= 1) {
        throw new Error("Le slug doit commencer par '@' et contenir au moins un caractère.");
      }
      const isUnique = await VitrinesModel.isSlugUnique(updateData.slug);
      if (!isUnique) throw new Error("Ce slug est déjà utilisé.");
      newSlug = updateData.slug;
    }

    const updates = { ...updateData, slug: newSlug, updatedAt: new Date().toISOString() };

    // Unifier category et type si l'un des deux est fourni
    if (updates.category || updates.type) {
      const unifiedCat = updates.category || updates.type;
      updates.category = unifiedCat;
      updates.type = unifiedCat;
    }

    const allowedFields = ["name", "type", "category", "description", "avatar", "coverImage", "address", "contact", "logo", "banner"];
    allowedFields.forEach(f => { if (!(f in updates)) delete updates[f]; });

    // IMAGE REPLACEMENT LOGIC
    const imageFields = ["avatar", "coverImage", "logo", "banner"];
    const imageStorage = require('../../utils/imageStorage');

    for (const field of imageFields) {
      if (updates[field] && vitrine[field] && updates[field] !== vitrine[field]) {
        // New image provided and it's different from the old one, cleanup old one
        imageStorage.delete(vitrine[field]).catch(err => console.error(`Error deleting old ${field}:`, err));
      }
    }

    // DETECTION DES CHANGEMENTS POUR LA PROPAGATION
    const categoryChanged = updates.category && updates.category !== vitrine.category;
    const slugChanged = updates.slug && updates.slug !== vitrine.slug;

    const result = await VitrinesModel.updateBySlug(slug, updates);

    // PROPAGATION AUX ANNONCES
    if (result && (categoryChanged || slugChanged)) {
      console.log(`[updateVitrineService] Propagating changes to annonces for vitrineId: ${vitrine.vitrineId}`);
      const AnnonceModel = require('../../models/annonceModel');

      const annonceUpdates = {};
      if (categoryChanged) annonceUpdates.vitrineCategory = updates.category;
      if (slugChanged) annonceUpdates.vitrineSlug = updates.slug;

      try {
        await AnnonceModel.getCollection().updateMany(
          { vitrineId: vitrine.vitrineId },
          { $set: annonceUpdates }
        );
        console.log(`[updateVitrineService] Propagation successful.`);
      } catch (err) {
        console.error(`[updateVitrineService] Error propagating to annonces:`, err);
        // On ne bloque pas le retour car la vitrine a été mise à jour, 
        // mais on log l'erreur.
      }
    }

    return result;
  }
};

module.exports = updateVitrineService;
