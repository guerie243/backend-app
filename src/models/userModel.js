const { getDb } = require('../config/db');

const COLLECTION = "Users";

class UserModel {
  constructor({ _id, profileName, username, email, phoneNumber, password, bio, profilePhoto, firebaseTokens, webPushSubscriptions }) {
    this._id = _id;
    this.profileName = profileName;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.bio = bio || "";
    this.profilePhoto = profilePhoto || "";
    // 🔔 Champs de notification
    this.firebaseTokens = firebaseTokens || [];
    this.webPushSubscriptions = webPushSubscriptions || [];
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

  // 🔔 Récupération des tokens de notification
  static async getNotificationTokens(userId) {
    const collection = this.getCollection();
    const user = await collection.findOne(
      { _id: userId },
      { projection: { firebaseTokens: 1, webPushSubscriptions: 1 } }
    );

    if (!user) {
      return { firebaseTokens: [], webPushSubscriptions: [] };
    }

    return {
      firebaseTokens: user.firebaseTokens || [],
      webPushSubscriptions: user.webPushSubscriptions || []
    };
  }

  // 🔔 Ajout d'un token de notification
  static async addNotificationToken(userId, type, tokenData) {
    const collection = this.getCollection();

    if (type === 'firebase') {
      // Ajouter le token uniquement s'il n'existe pas déjà
      await collection.updateOne(
        { _id: userId },
        { $addToSet: { firebaseTokens: tokenData } }
      );
    } else if (type === 'webpush') {
      // Pour Web Push, remplacer si même endpoint (éviter doublons)
      await collection.updateOne(
        { _id: userId },
        { $pull: { webPushSubscriptions: { endpoint: tokenData.endpoint } } }
      );
      await collection.updateOne(
        { _id: userId },
        { $push: { webPushSubscriptions: tokenData } }
      );
    }

    return { success: true };
  }
}

module.exports = UserModel;
