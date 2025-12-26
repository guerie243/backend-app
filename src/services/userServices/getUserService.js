const UserModel = require("../../models/userModel");

const getPublicUser = async (username) => {
  const user = await UserModel.findOne({ username });
  if (!user) throw new Error("Utilisateur introuvable");

  const { profileName, username: uname, bio, profilePhoto } = user;
  return { profileName, username: uname, bio, profilePhoto };
};

const getPrivateUser = async (userId, fields = []) => {
  const user = await UserModel.findOne({ $or: [{ _id: userId }] });
  if (!user) throw new Error("Utilisateur introuvable");

  if (fields.length === 0) {
    const { password, _id, ...safeUser } = user;
    return safeUser;
  }

  const filtered = {};
  fields.forEach(f => {
    if (user.hasOwnProperty(f) && f !== "_id" && f !== "password") {
      filtered[f] = user[f];
    }
  });

  return filtered;
};

module.exports = { getPublicUser, getPrivateUser };
