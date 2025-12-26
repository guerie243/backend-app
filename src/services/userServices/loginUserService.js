const UserModel = require('../../models/userModel');
const comparePassword = require('../../utils/comparePassword');
const generateToken = require("../../utils/generateTokenJWT");

const loginUserService = async ({ identifier, password }) => {
  // Rechercher l'utilisateur par username, email ou phoneNumber
  const user = await UserModel.findOne({
    $or: [
      { username: identifier },
      { email: identifier },
      { phoneNumber: identifier }
    ]
  });

  if (!user) {
    throw new Error('Utilisateur introuvable');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Mot de passe incorrect');
  }

  // Générer le JWT avec userId (cohérence avec register)
  const token = generateToken({ userId: user._id, username: user.username });

  // Convertir le user en objet manipulable (si Mongoose document)
  const userObj = user.toObject ? user.toObject() : { ...user };

  // Mapper _id vers userId pour le frontend
  const safeUser = {
    ...userObj,
    userId: userObj._id,
  };

  // Retirer les champs sensibles
  delete safeUser.password;
  delete safeUser._id;

  return { user: safeUser, token };
};

module.exports = loginUserService;
