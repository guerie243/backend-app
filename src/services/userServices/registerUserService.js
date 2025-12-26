const UserModel = require("../../models/userModel");
const hashPassword = require("../../utils/hashPassword");
const generateToken = require("../../utils/generateTokenJWT");
const generateUsername = require("../../utils/generateUsername");
const generateUserId = require("../../utils/generateUserId");
const createVitrineService = require('../vitrineServices/createVitrineService');


const registerUserService = async ({ profileName, email, phoneNumber, password }) => {
    try {
        const findConditions = [];
        if (email) findConditions.push({ email });
        if (phoneNumber) findConditions.push({ phoneNumber });

        if (findConditions.length > 0) {
            const existingUser = await UserModel.findOne({ $or: findConditions });
            if (existingUser) {
                if (existingUser.email === email) return { success: false, message: "Cet email est déjà associé à un compte." };
                if (existingUser.phoneNumber === phoneNumber) return { success: false, message: "Ce numéro de téléphone est déjà associé à un compte." };
                return { success: false, message: "Un conflit d'identifiant existe déjà." };
            }
        }

        const checkUsernameExists = (name) => UserModel.exists({ username: name });
        const username = await generateUsername(profileName, checkUsernameExists);

        const userId = generateUserId();
        const hashedPassword = await hashPassword(password);

        const newUser = await UserModel.create({
            _id: userId,
            profileName,
            username,
            email: email || null,
            phoneNumber: phoneNumber || null,
            password: hashedPassword,
        });

        await createVitrineService.createVitrine(newUser._id, {
            name: `Vitrine de ${profileName}`,
            type: "general",
            description: "",
            avatar: "",
            coverImage: ""
        });

        const token = generateToken({ userId: newUser._id });

        return {
            success: true,
            message: "Utilisateur créé avec succès.",
            userId: newUser._id,
            username: newUser.username,
            token,
        };
    } catch (error) {
        console.error("Erreur service registerUser:", error);
        return { success: false, message: "Erreur interne du serveur lors de l'enregistrement." };
    }
};

module.exports = registerUserService;
