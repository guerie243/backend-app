const AnnonceModel = require('../../models/annonceModel');

const getAnnoncesByVitrineService = async (vitrineIdOrSlug, page = 1, limit = 10) => {
    // Stratégie hybride : on essaie d'abord par ID (prioritaire), sinon par Slug
    // Cela permet de supporter les appels avec ID (recommandé) tout en gardant la compatibilité avec les slugs (SEO/Links)

    // 1. Essai par Vitrine ID
    // Si l'identifiant ressemble à un ID (pas d'espaces, pas trop long, ou format spécifique)
    // Ici on tente la recherche directe par ID.
    const resultById = await AnnonceModel.getByVitrineId({ vitrineId: vitrineIdOrSlug, limit });

    if (resultById && resultById.data && resultById.data.length > 0) {
        return resultById;
    }

    // 2. Repli sur le Slug
    // Si la recherche par ID ne donne rien (ou si ce n'était pas un ID), on cherche par slug
    console.log(`[getAnnoncesByVitrine] Aucun résultat par ID pour '${vitrineIdOrSlug}', tentative par Slug.`);
    return AnnonceModel.getByVitrineSlug({ vitrineSlug: vitrineIdOrSlug, limit });
};

module.exports = getAnnoncesByVitrineService;
