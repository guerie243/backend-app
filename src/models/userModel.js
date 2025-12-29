const { getDb } = require('../config/db');

const COLLECTION = "Users";

class UserModel {
  constructor({ _id, profileName, username, email, phoneNumber, password, bio, profilePhoto }) {
    this._id = _id;
    this.profileName = profileName;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.bio = bio || "";
    this.profilePhoto = profilePhoto || "";
  }

  static getCollection() {
    return getDb().collection(COLLECTION);
  }

  // Création d'un nouvel utilisateur
  static async create(userObj) {
    if (!userObj._id) {
      throw new Error("L'ID de l'utilisateur est requis");
    }

    const collection = this.getCollection();
    const existing = await collection.findOne({ _id: userObj._id });
    if (existing) {
      throw new Error("L'ID fourni existe déjà. L'enregistrement a échoué.");
    }

    const newUser = new UserModel(userObj);
    await collection.insertOne({ ...newUser });

    return newUser;
  }

  // Recherche d'un utilisateur
  static async findOne(query) {
    const collection = this.getCollection();
    let result = null;

    if (query.$or && Array.isArray(query.$or)) {
      // MongoDB supporte nativement $or
      result = await collection.findOne(query);
    } else {
      result = await collection.findOne(query);
    }

    return result;
  }

  // Vérification existence username/email/phone
  static async exists(query) {
    const collection = this.getCollection();
    const count = await collection.countDocuments(query, { limit: 1 });
    return count > 0;
  }

  // Suppression d'un utilisateur par ID
  static async deleteById(userId) {
    const collection = this.getCollection();
    const user = await collection.findOne({ _id: userId });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    await collection.deleteOne({ _id: userId });
    return user;
  }
}

module.exports = UserModel;
