const createvitrine = require('../../services/vitrineServices/createVitrineService');
const { invalidateVitrinesCache } = require('../../utils/cache');

const createVitrineController = async (req, res) => {
  try {
    const ownerId = req.user?.userId;
    const vitrineData = req.body;

    // Vérification des informations obligatoires
    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID manquant dans la requête.' });
    }
    if (!vitrineData?.name) {
      return res.status(400).json({ message: 'Le nom de la vitrine est obligatoire.' });
    }

    // Appel du service pour créer la vitrine
    const newVitrine = await createvitrine.createVitrine(ownerId, vitrineData);

    // Invalider le cache car une nouvelle vitrine a été créée
    invalidateVitrinesCache();

    // Retour de la vitrine créée avec un avertissement si le stockage est HS
    return res.status(201).json({
      ...newVitrine,
      warning: req.imageWarning || null
    });
  } catch (error) {
    // Gestion des erreurs venant du service
    return res.status(500).json({ message: 'Erreur lors de la création de la vitrine', error: error.message });
  }
};

module.exports = createVitrineController;
