const UserModel = require("../../models/userModel");
const comparePassword = require("../../utils/comparePassword");

async function deleteUser(userId, password) {
  try {
    const user = await UserModel.findOne({ $or: [{ _id: userId }] });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error("Mot de passe incorrect");
    }

    // Suppression en cascade
    const VitrineModel = require("../../models/vitrine-model");
    const AnnonceModel = require("../../models/annonceModel");

    try {
      await AnnonceModel.deleteAllByOwnerId(userId);
      await VitrineModel.deleteAllByOwnerId(userId);
    } catch (cascadeError) {
      console.error("Erreur suppression cascade:", cascadeError);
    }

    const deletedUser = await UserModel.deleteById(userId);
    return deletedUser;
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    throw error;
  }
}

module.exports = { deleteUser };
