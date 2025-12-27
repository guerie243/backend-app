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

    const allowedFields = ["name", "type", "category", "description", "avatar", "coverImage", "address", "contact", "logo", "banner"];
    const updates = { ...updateData, slug: newSlug, updatedAt: new Date().toISOString() };
    allowedFields.forEach(f => { if (!(f in updates)) delete updates[f]; });

    const result = await VitrinesModel.updateBySlug(slug, updates);

    // Si la catégorie a changé, on propage aux annonces
    const oldCat = vitrine.category || vitrine.type;
    const newCat = result.category || result.type;

    if (newCat && newCat !== oldCat) {
      console.log(`[updateVitrineService] Propagating category change: ${oldCat} -> ${newCat}`);
      const db = require('firebase-admin').firestore();
      const annoncesSnap = await db.collection('Annonces').where('vitrineSlug', '==', result.slug).get();
      if (!annoncesSnap.empty) {
        const batch = db.batch();
        annoncesSnap.docs.forEach(doc => {
          batch.update(doc.ref, { vitrineCategory: newCat });
        });
        await batch.commit();
        console.log(`[updateVitrineService] Propagated to ${annoncesSnap.size} annonces.`);
      }
    }

    return result;
  }
};

module.exports = updateVitrineService;
