const express = require('express');
const router = express.Router();

// Middleware d'authentification
const authMiddleware = require('../middlewares/userMiddlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const imageUploadInterceptor = require('../middlewares/imageUploadInterceptor');
const cacheMiddleware = require('../middlewares/cacheMiddleware');

// Controllers
const createVitrineController = require('../controllers/vitrineControllers/createVitrineController');
const updateVitrineController = require('../controllers/vitrineControllers/updateVitrineController');
const deleteVitrineController = require('../controllers/vitrineControllers/deleteVitrineController');
const getVitrineBySlugController = require('../controllers/vitrineControllers/getVitrineBySlugController');
const getAllVitrinesForOwnerController = require('../controllers/vitrineControllers/getAllVitrinesForOwnerController');
const getAllVitrinesController = require('../controllers/vitrineControllers/getAllVitrinesController');
const getVitrineByIdController = require('../controllers/vitrineControllers/getVitrineByIdController');

// --- ROUTES VITRINES (MVP) ---

// Créer une vitrine (propriétaire uniquement)
// POST /vitrines/
router.post('/', authMiddleware, uploadMiddleware.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), imageUploadInterceptor('vitrines'), createVitrineController);

// Obtenir toutes les vitrines du propriétaire connecté
// GET /vitrines/my-vitrines
// Doit être défini AVANT les routes paramétrées comme /:slog
router.get('/myvitrines', authMiddleware, cacheMiddleware, getAllVitrinesForOwnerController);

// Obtenir toutes les vitrines (public) avec filtrage et pagination
// GET /vitrines?category=general&search=shop&page=1&limit=6
// Doit être défini AVANT la route /:slog pour éviter les conflits
router.get('/', cacheMiddleware, getAllVitrinesController);

// Modifier une vitrine par slug (propriétaire uniquement)
// PATCH /vitrines/myvitrine/:slug
router.patch('/myvitrine/:slug', authMiddleware, uploadMiddleware.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), imageUploadInterceptor('vitrines'), updateVitrineController);

// Supprimer une vitrine par slug (propriétaire uniquement)
// DELETE /vitrines/myvitrine/:slug
router.delete('/myvitrine/:slug', authMiddleware, deleteVitrineController);

// 🔔 Obtenir une vitrine par son ID (public, utilisé par Module 2 pour notifications)
// GET /vitrines/id/:vitrineId
// IMPORTANT : Doit être avant /:slug pour éviter conflits de routage
router.get('/id/:vitrineId', cacheMiddleware, getVitrineByIdController);

// Obtenir une vitrine par slug (public)
// GET /vitrines/:slug
router.get('/:slug', cacheMiddleware, getVitrineBySlugController);

module.exports = router;
