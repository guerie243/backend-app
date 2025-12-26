// index.js (Controllers)

// Importez les fonctions de contrôleur directement
const registerUserController = require('./registerUserController');
const updateUserController = require('./updateUserController');
const deleteUserController = require('./deleteUserController');
const loginUserController = require('./loginUserController');
const { getPublicUserController, getPrivateUserController } = require('./getUserController');

module.exports = {
    registerUserController,
    updateUserController,
    getPublicUserController,
    getPrivateUserController,
    deleteUserController,
    loginUserController
}; 