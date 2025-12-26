const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement depuis le fichier .env à la racine du backend
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

module.exports = {
	HASH_SECRET: process.env.HASH_SECRET,
	JWT_SECRET: process.env.JWT_SECRET,
	PORT: process.env.PORT || 3000,
	FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT
};
