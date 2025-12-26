const { registerUserController } = require("../../controllers/userControllers");

const registerUserMiddleware = (req, res, next) => {
  try {
    const { profileName, email, phoneNumber, password } = req.body;

    // 1. Vérifier la présence des champs obligatoires
    if (!profileName || !password || (!email && !phoneNumber)) {
      return res.status(400).json({ 
        message: "Le nom de profil, le mot de passe et au moins un moyen de contact (email ou téléphone) sont obligatoires." 
      });
    }

    // 2. Vérifier le format de l'email si fourni
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Adresse email invalide." });
      }
    }

    // 3. Vérifier le format du téléphone si fourni (STRICT : seulement chiffres et signe '+')
    if (phoneNumber) {
      // NOUVELLE REGEX : commence par un '+' optionnel, suivi de 6 à 20 chiffres, sans espaces ni tirets.
      const phoneRegex = /^\+?\d{6,20}$/; 
      
      if (!phoneRegex.test(phoneNumber.trim())) {
        return res.status(400).json({ 
          message: "Numéro de téléphone invalide. Veuillez inclure le code pays, et n'utilisez pas d'espaces ni de tirets." 
        });
      }
    }

    // 4. Vérifier le mot de passe (Minimum 8 caractères, Majuscule, Minuscule, Chiffre)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{}|;:'",.<>?]{8,100}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Mot de passe invalide. Il doit contenir entre 8 et 100 caractères, et inclure au moins : une majuscule, une minuscule et un chiffre." 
      });
    }

    // Tout est correct
    next();
  } catch (error) {
    console.error("Erreur de validation:", error);
    res.status(500).json({ message: "Erreur interne lors de la validation de l'inscription.", error: error.message });
  }
};

module.exports = registerUserMiddleware;