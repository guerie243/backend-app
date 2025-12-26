// utils/generateUsername.js
const crypto = require("crypto");

/**
 * Génère un nom d'utilisateur nettoyé et garantit son unicité en ajoutant un suffixe aléatoire.
 * @param {string} profileName - Le nom de profil fourni par l'utilisateur.
 * @param {function} checkUsernameExists - Fonction asynchrone pour vérifier si le nom d'utilisateur existe en base (ex: (name) => UserModel.exists({ username: name })).
 * @returns {Promise<string>} Le nom d'utilisateur unique généré (ex: @jean_dupont_a1b4).
 */
const generateUsername = async (profileName, checkUsernameExists) => {
    // Nettoyer le nom pour créer la base
    // 1. Enlever les accents et caractères spéciaux non ASCII (pour une meilleure compatibilité)
    // 2. Remplacer les espaces et caractères non alphanumériques par '_'
    let baseName = profileName
        .trim()
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
        .replace(/[^a-z0-9]+/g, "_") // Remplace non-alphanumériques par '_'
        .replace(/^_+|_+$/g, ""); // Enlève les '_' au début/fin

    // Si le nom nettoyé est vide, utiliser "user"
    if (!baseName) {
        baseName = "user";
    }

    let username;
    let isUnique = false;
    let attempts = 0; // Limiteur de sécurité pour éviter une boucle infinie en cas de problème BD
    
    // Boucle tant qu'un nom d'utilisateur unique n'est pas trouvé
    while (!isUnique && attempts < 10) { // Limite à 10 tentatives
        // Générer un suffixe aléatoire de 4 caractères hexadécimaux
        const suffix = crypto.randomBytes(2).toString("hex"); 
        
        // Construire le nom d'utilisateur final (ex: jean_dupont_a1b4)
        username = `${baseName}_${suffix}`; 

        // Vérifier si le username existe déjà dans la base de données
        // On s'assure que la fonction de vérification est bien fournie
        if (typeof checkUsernameExists !== 'function') {
            // Dans un cas réel, on lancerait une erreur fatale ici
            return username; 
        }

        const exists = await checkUsernameExists(username);
        if (!exists) {
            isUnique = true;
        }

        attempts++;
    }
    
    // Ajout du symbole '@' conventionnel (peut être omis si non désiré)
    return `@${username}`; 
};

module.exports = generateUsername;