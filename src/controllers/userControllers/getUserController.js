// controllers/userControllers/getUserController.js
const { getPublicUser, getPrivateUser } = require('../../services/userServices/getUserService');

/**
 * GET public pour voir un profil d'un autre utilisateur
 */
const getPublicUserController = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await getPublicUser(username);

    res.status(200).json({ message: 'Utilisateur public récupéré', user });
  } catch (error) {
    console.error(`[getPrivateUserController] Error for userId ${req.user.userId}:`, error);
    res.status(404).json({ message: error.message });
  }
};

/**
 * GET privé / spécifique pour l'utilisateur connecté
 */
const getPrivateUserController = async (req, res) => {
  try {
    const userId = req.user.userId; // du middleware JWT
    const fields = req.query.fields ? req.query.fields.split(',') : [];

    const user = await getPrivateUser(userId, fields);

    res.status(200).json({ message: 'Profil récupéré', user });
  } catch (error) {
    console.error(`[getPrivateUserController] Error for userId ${req.user.userId}:`, error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getPublicUserController, getPrivateUserController };
