const loginUserService = require('../../services/userServices/loginUserService');

const loginUserController = async (req, res) => {
  try {
    // Frontend envoie 'email' ou 'identifier'
    const { identifier, email, password } = req.body;

    // Priorité à identifiant, sinon email
    const loginId = identifier || email;

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Veuillez fournir vos identifiants et mot de passe' });
    }

    const result = await loginUserService({ identifier: loginId, password });

    res.status(200).json({
      success: true, // Requis par le frontend
      message: 'Connexion réussie',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = loginUserController;
