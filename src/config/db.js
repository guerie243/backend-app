const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("❌ MONGODB_URI non trouvé dans les variables d'environnement.");
    process.exit(1);
}

const client = new MongoClient(uri);

let db = null;

async function connectToDatabase() {
    if (db) return db;

    try {
        await client.connect();
        const dbName = process.env.MONGODB_DB_NAME || 'AndyDB';
        db = client.db(dbName); // Utilise la DB spécifiée ou AndyDB par défaut
        console.log(`✅ Connecté avec succès à MongoDB Atlas (Base: ${dbName})`);
        return db;
    } catch (error) {
        console.error("❌ Erreur de connexion à MongoDB:", error.message);
        throw error;
    }
}

function getDb() {
    if (!db) {
        throw new Error("La base de données n'est pas initialisée. Appelez connectToDatabase() d'abord.");
    }
    return db;
}

module.exports = { connectToDatabase, getDb };
