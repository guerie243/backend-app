const UserModel = require("../../models/userModel");
const comparePassword = require("../../utils/comparePassword");
const hashPassword = require("../../utils/hashPassword");

async function updateUserProfile(userId, updateData) {
    try {
        const user = await UserModel.findOne({ $or: [{ _id: userId }] });
        if (!user) throw new Error("Utilisateur non trouvé");

        // Mot de passe
        if (updateData.password) {
            if (!updateData.oldPassword) throw new Error("L'ancien mot de passe est requis");
            const isValid = await comparePassword(updateData.oldPassword, user.password);
            if (!isValid) throw new Error("Ancien mot de passe incorrect");
            user.password = await hashPassword(updateData.password);
        }

        // Champs uniques
        const uniqueFields = ["username", "email", "phoneNumber"];
        for (const field of uniqueFields) {
            if (updateData[field] && updateData[field] !== user[field]) {
                const exists = await UserModel.exists({ [field]: updateData[field] });
                if (exists) throw new Error(`${field} est déjà utilisé`);
                user[field] = updateData[field];
            }
        }

        // Champs simples
        const simpleFields = ["profileName", "bio", "profilePhoto"];
        for (const field of simpleFields) {
            if (updateData[field] !== undefined) user[field] = updateData[field];
        }

        // Mise à jour Firestore
        const admin = require("firebase-admin");
        const db = admin.firestore();
        await db.collection("Users").doc(userId.toString()).set({ ...user });

        const { password: pwd, _id, ...safeUser } = user;
        return safeUser;
    } catch (error) {
        console.error("Erreur updateUserProfile:", error);
        throw error;
    }
}

module.exports = { updateUserProfile };
