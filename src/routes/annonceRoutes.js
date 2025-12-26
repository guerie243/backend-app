// routes/annoncesRoutes.js

const express = require('express');
const router = express.Router();

// Middlewares
const authMiddleware = require('../middlewares/userMiddlewares/authMiddleware');

// Controllers (à créer ensuite)
const createAnnonceController = require('../controllers/annonceControllers/createAnnonceController');
const updateAnnonceController = require('../controllers/annonceControllers/updateAnnonceController');
const deleteAnnonceController = require('../controllers/annonceControllers/deleteAnnonceController');
const getAnnonceBySlugController = require('../controllers/annonceControllers/getAnnonceBySlugController');
const getAnnoncesByVitrineController = require('../controllers/annonceControllers/getAnnoncesByVitrineSlogController');
const getFeedController = require('../controllers/annonceControllers/getFeedController');

// Routes des annonces
// IMPORTANT: Les routes spécifiques doivent être définies AVANT les routes avec paramètres
router.get('/feed', getFeedController);  // Récupérer le feed d'annonces (doit être avant /:slug)
router.get('/vitrine/:vitrineSlug', getAnnoncesByVitrineController);  // Récupérer toutes les annonces d'une vitrine
router.post('/', authMiddleware, createAnnonceController);   // Créer une annonce
router.patch('/:slug', authMiddleware, updateAnnonceController);  // Mettre à jour une annonce
router.delete('/:slug', authMiddleware, deleteAnnonceController);  // Supprimer une annonce
router.get('/:slug', getAnnonceBySlugController);  // Récupérer une annonce par son slug

module.exports = router;
