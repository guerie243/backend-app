const UserModel = require("../../models/userModel");
const comparePassword = require("../../utils/comparePassword");
const generateToken = require("../../utils/generateTokenJWT");

const loginUserService = async ({ identifier, password }) => {
  const user = await UserModel.findOne({
    $or: [
      { username: identifier },
      { email: identifier },
      { phoneNumber: identifier }
    ]
  });

  if (!user) throw new Error("Utilisateur introuvable");

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) throw new Error("Mot de passe incorrect");

  const token = generateToken({ userId: user._id, username: user.username });

  const safeUser = {
    ...user,
    userId: user._id
  };

  delete safeUser.password;
  delete safeUser._id;

  return { user: safeUser, token };
};

module.exports = loginUserService;
