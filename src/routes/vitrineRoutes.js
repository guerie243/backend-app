const express = require('express');
const router = express.Router();

// Middleware d'authentification
const authMiddleware = require('../middlewares/userMiddlewares/authMiddleware');

// Controllers
const createVitrineController = require('../controllers/vitrineControllers/createVitrineController');
const updateVitrineController = require('../controllers/vitrineControllers/updateVitrineController');
const deleteVitrineController = require('../controllers/vitrineControllers/deleteVitrineController');
const getVitrineBySlogController = require('../controllers/vitrineControllers/getVitrineBySlogController');
const getAllVitrinesForOwnerController = require('../controllers/vitrineControllers/getAllVitrinesForOwnerController');
const getAllVitrinesController = require('../controllers/vitrineControllers/getAllVitrinesController');

// --- ROUTES VITRINES (MVP) ---

// Créer une vitrine (propriétaire uniquement)
// POST /vitrines/
router.post('/', authMiddleware, createVitrineController);

// Obtenir toutes les vitrines du propriétaire connecté
// GET /vitrines/my-vitrines
// Doit être défini AVANT les routes paramétrées comme /:slog
router.get('/myvitrines', authMiddleware, getAllVitrinesForOwnerController);

// Obtenir toutes les vitrines (public) avec filtrage et pagination
// GET /vitrines?category=general&search=shop&page=1&limit=6
// Doit être défini AVANT la route /:slog pour éviter les conflits
router.get('/', getAllVitrinesController);

// Modifier une vitrine par slug (propriétaire uniquement)
// PATCH /vitrines/myvitrine/:slug
router.patch('/myvitrine/:slug', authMiddleware, updateVitrineController);

// Supprimer une vitrine par slug (propriétaire uniquement)
// DELETE /vitrines/myvitrine/:slug
router.delete('/myvitrine/:slug', authMiddleware, deleteVitrineController);

// Obtenir une vitrine par slug (public)
// GET /vitrines/:slug
router.get('/:slug', getVitrineBySlogController);

module.exports = router;
