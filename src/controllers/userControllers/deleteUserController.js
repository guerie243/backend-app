// controllers/userControllers/deleteUserController.js
const { deleteUser } = require('../../services/userServices/deleteUserService');

const deleteUserController = async (req, res) => {
  try {
    const userId = req.user.userId;      // ID de l'utilisateur via JWT
    const { password } = req.body;       // Mot de passe fourni dans le body

    if (!password) {
      return res.status(400).json({ message: 'Mot de passe requis' });
    }

    const deletedUser = await deleteUser(userId, password);

    res.status(200).json({
      message: 'Utilisateur supprimé avec succès',
      user: deletedUser
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = deleteUserController;
