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

    return await VitrinesModel.updateBySlug(slug, updates);
  }
};

module.exports = updateVitrineService;
