//Import d'Express
const express = require('express');
const cors = require('cors');
// Import des configurations (ceci charge dotenv)
require('./src/config/config');

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

console.log("!!! SERVER VERSION CHECK: V2 (FIX APPLIED) !!!"); // New console log

// Middleware pour logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Middleware pour CORS
app.use(cors());

// Middleware pour lire les données JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes
const userRoutes = require('./src/routes/userRoutes');
const vitrineRoutes = require('./src/routes/vitrineRoutes');
const annonceRoutes = require('./src/routes/annonceRoutes');
// Connexion des routes
app.use('/vitrines', vitrineRoutes); // Routes des vitrines
app.use('/users', userRoutes);       // Routes des utilisateurs
app.use('/annonces', annonceRoutes); // Routes des annonces
// Route de santé pour tester le serveur
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Serveur en bonne santé',
    timestamp: new Date()
  });
});

// Middleware de gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.path,
    method: req.method
  });
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur globale:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
