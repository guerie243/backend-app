// routes/annoncesRoutes.js

const express = require('express');
const router = express.Router();

// Middlewares
const authMiddleware = require('../middlewares/userMiddlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const imageUploadInterceptor = require('../middlewares/imageUploadInterceptor');
const cacheMiddleware = require('../middlewares/cacheMiddleware');

// Controllers (à créer ensuite)
const createAnnonceController = require('../controllers/annonceControllers/createAnnonceController');
const updateAnnonceController = require('../controllers/annonceControllers/updateAnnonceController');
const deleteAnnonceController = require('../controllers/annonceControllers/deleteAnnonceController');
const getAnnonceBySlugController = require('../controllers/annonceControllers/getAnnonceBySlugController');
const getAnnoncesByVitrineController = require('../controllers/annonceControllers/getAnnoncesByVitrineController');
const getFeedController = require('../controllers/annonceControllers/getFeedController');
const likeAnnonceController = require('../controllers/annonceControllers/likeAnnonceController');
const unlikeAnnonceController = require('../controllers/annonceControllers/unlikeAnnonceController');

// Routes des annonces
// IMPORTANT: Les routes spécifiques doivent être définies AVANT les routes avec paramètres
router.get('/feed', cacheMiddleware, getFeedController);  // Récupérer le feed d'annonces (doit être avant /:slug)
router.get('/vitrine/:vitrineIdOrSlug', cacheMiddleware, getAnnoncesByVitrineController);  // Récupérer toutes les annonces d'une vitrine
router.post('/', authMiddleware, uploadMiddleware.array('images', 10), imageUploadInterceptor('annonces'), createAnnonceController);   // Créer une annonce
router.patch('/:slug', authMiddleware, uploadMiddleware.array('images', 10), imageUploadInterceptor('annonces'), updateAnnonceController);  // Mettre à jour une annonce
router.delete('/:slug', authMiddleware, deleteAnnonceController);  // Supprimer une annonce

// Routes de likes (publiques - pas d'authentification requise)
router.post('/:slug/like', likeAnnonceController);  // Ajouter un like à une annonce
router.delete('/:slug/like', unlikeAnnonceController);  // Retirer un like d'une annonce

router.get('/:slug', cacheMiddleware, getAnnonceBySlugController);  // Récupérer une annonce par son slug

module.exports = router;
