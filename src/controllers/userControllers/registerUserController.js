// registerUserController.js
// ----------------------------------------------------------------------
const registerUserService = require("../../services/userServices/registerUserService");

const registerUser = async (req, res) => {
    try {
        // Récupérer les données validées par le middleware
        const { profileName, email, phoneNumber, password } = req.body;

        const result = await registerUserService({ profileName, email, phoneNumber, password });

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(201).json(result);

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return res.status(500).json({ message: "Erreur interne lors de l'inscription.", error: error.message });
    }
};

// 🌟 CORRECTION : Exportez la fonction 'registerUser' que vous avez définie.
module.exports = registerUser;