const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

const db = admin.firestore();
const usersCollection = db.collection("Users");

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

  // Création d'un nouvel utilisateur
  static async create(userObj) {
    if (!userObj._id) {
      throw new Error("L'ID de l'utilisateur est requis pour Firestore");
    }

    const docRef = usersCollection.doc(userObj._id.toString());
    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      throw new Error("L'ID fourni existe déjà. L'enregistrement a échoué.");
    }

    const newUser = new UserModel(userObj);
    await docRef.set({ ...newUser });

    return newUser;
  }

  // Recherche d'un utilisateur
  static async findOne(query) {
    let snapshot;

    if (query.$or && Array.isArray(query.$or)) {
      for (const cond of query.$or) {
        if (cond.email) {
          snapshot = await usersCollection.where("email", "==", cond.email).limit(1).get();
        } else if (cond.phoneNumber) {
          snapshot = await usersCollection.where("phoneNumber", "==", cond.phoneNumber).limit(1).get();
        } else if (cond.username) {
          snapshot = await usersCollection.where("username", "==", cond.username).limit(1).get();
        } else if (cond._id) {
          // Supports finding by ID (string or number depending on storage, assuming string from AuthMiddleware)
          const docRef = usersCollection.doc(cond._id.toString());
          const docSnapshot = await docRef.get();
          if (docSnapshot.exists) {
            return docSnapshot.data();
          }
        }

        if (snapshot && !snapshot.empty) {
          return snapshot.docs[0].data();
        }
      }
      return null;
    }

    if (query.email) {
      snapshot = await usersCollection.where("email", "==", query.email).limit(1).get();
    } else if (query.phoneNumber) {
      snapshot = await usersCollection.where("phoneNumber", "==", query.phoneNumber).limit(1).get();
    } else if (query.username) {
      snapshot = await usersCollection.where("username", "==", query.username).limit(1).get();
    }

    return snapshot && !snapshot.empty ? snapshot.docs[0].data() : null;
  }

  // Vérification existence username/email/phone
  static async exists(query) {
    if (query.username) {
      const snapshot = await usersCollection.where("username", "==", query.username).limit(1).get();
      return !snapshot.empty;
    }
    if (query.email) {
      const snapshot = await usersCollection.where("email", "==", query.email).limit(1).get();
      return !snapshot.empty;
    }
    if (query.phoneNumber) {
      const snapshot = await usersCollection.where("phoneNumber", "==", query.phoneNumber).limit(1).get();
      return !snapshot.empty;
    }
    return false;
  }

  // Suppression d'un utilisateur par ID
  static async deleteById(userId) {
    const docRef = usersCollection.doc(userId.toString());
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new Error("Utilisateur non trouvé");
    }

    await docRef.delete();
    return docSnapshot.data();
  }
}

module.exports = UserModel;
