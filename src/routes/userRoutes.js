const express = require('express');
const Router = express.Router();

// 1. Importez les middlewares directement depuis leur fichier
const registerUserMiddleware = require('../middlewares/userMiddlewares/registerUserMiddleware');
const authMiddleware = require('../middlewares/userMiddlewares/authMiddleware');

// 2. Importez les fonctions de contrôleur directement
// Assurez-vous que le chemin vers votre index de contrôleurs est correct.
const userControllers = require('../controllers/userControllers');
const {
    registerUserController,
    updateUserController,
    deleteUserController,
    loginUserController,
    getPublicUserController,
    getPrivateUserController
} = userControllers;

// 🔔 Contrôleurs de notification
const getUserNotificationTokensController = require('../controllers/userControllers/getUserNotificationTokensController');
const registerNotificationTokenController = require('../controllers/userControllers/registerNotificationTokenController');

// 1️⃣ Enregistrer un utilisateur (POST /)
Router.post(
    '/',
    registerUserMiddleware,
    registerUserController
);

const uploadMiddleware = require('../middlewares/uploadMiddleware');
const imageUploadInterceptor = require('../middlewares/imageUploadInterceptor');

// 2️⃣ Modifier le profil utilisateur (PATCH /)
Router.patch(
    '/',
    authMiddleware,
    uploadMiddleware.single('profilePhoto'),
    imageUploadInterceptor('users'),
    updateUserController
);

// 3️⃣ Supprimer un utilisateur (DELETE /)
Router.delete(
    '/',
    authMiddleware,
    deleteUserController
);

// 4️⃣ Récupérer le profil utilisateur (GET /)
// CORRECTION : Le 'R' de Router était manquant
Router.get(
    '/',
    authMiddleware,
    getPrivateUserController
);

// 6️⃣ Connexion utilisateur (POST /login)
Router.post(
    '/login',
    loginUserController
);

// 5️⃣ Récupérer le profil public d'un utilisateur par son nom d'utilisateur (GET /:username)
Router.get(
    '/:username',
    getPublicUserController
);

// 🔔 7️⃣ Enregistrer un token de notification (POST /notifications/register)
Router.post(
    '/notifications/register',
    authMiddleware,
    registerNotificationTokenController
);

// 🔔 8️⃣ Récupérer les tokens de notification d'un utilisateur (GET /:userId/notifications)
Router.get(
    '/:userId/notifications',
    getUserNotificationTokensController
);

module.exports = Router;