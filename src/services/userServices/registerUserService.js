// services/userServices/registerUser.js
const UserModel = require("../../models/userModel");

// Import utilitaires
const hashPassword = require("../../utils/hashPassword");
const generateToken = require("../../utils/generateTokenJWT");
const generateUsername = require("../../utils/generateUsername");
const generateUserId = require("../../utils/generateUserId");

// 🔥 Import du service vitrine
const createVitrineService = require("../vitrineServices/createVitrineService");

const registerUserService = async ({ profileName, email, phoneNumber, password }) => {
    try {
        // --- 1. Vérification unicité email/phone ---
        const findConditions = [];
        if (email) findConditions.push({ email });
        if (phoneNumber) findConditions.push({ phoneNumber });

        if (findConditions.length > 0) {
            const existingUser = await UserModel.findOne({ $or: findConditions });

            if (existingUser) {
                if (existingUser.email === email) {
                    return { success: false, message: "Cet email est déjà associé à un compte." };
                }
                if (existingUser.phoneNumber === phoneNumber) {
                    return { success: false, message: "Ce numéro de téléphone est déjà associé à un compte." };
                }
                return { success: false, message: "Un conflit d'identifiant existe déjà." };
            }
        }

        // --- 2. Génération des identifiants ---
        const checkUsernameExists = (name) => UserModel.exists({ username: name });
        const username = await generateUsername(profileName, checkUsernameExists);

        const userId = generateUserId();

        // --- 3. Création du user ---
        const hashedPassword = await hashPassword(password);

        const newUser = await UserModel.create({
            _id: userId,
            profileName,
            username,
            email: email || null,
            phoneNumber: phoneNumber || null,
            password: hashedPassword,
        });

        // --- 4. 🔥 Création automatique de la vitrine de l'utilisateur ---
        await createVitrineService.createVitrine(newUser._id, {
            name: `Vitrine de ${profileName}`,
            type: "general",
            description: "",
            avatar: "",
            coverImage: ""
        });

        // --- 5. Token JWT ---
        const token = generateToken({
            userId: newUser._id,
        });

        const safeUser = {
            ...newUser._doc,
            userId: newUser._id
        };
        delete safeUser.password;
        delete safeUser._id;

        return {
            success: true,
            message: "Utilisateur créé avec succès.",
            token,
            user: safeUser
        };

    } catch (error) {
        console.error("Erreur service registerUser:", error);
        return { success: false, message: "Erreur interne du serveur lors de l'enregistrement." };
    }
};

module.exports = registerUserService;
