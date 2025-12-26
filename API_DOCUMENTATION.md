# 📚 Documentation Complète des API Backend

## 📋 Table des Matières
1. [Utilisateurs (Users)](#utilisateurs-users)
2. [Vitrines (Vitrines)](#vitrines-vitrines)
3. [Annonces (Annonces)](#annonces-annonces)
4. [Feed & Recherche](#feed--recherche)

---

## 🔐 Authentification

La plupart des endpoints nécessitent un token JWT dans le header Authorization :
```
Authorization: Bearer <votre_token_jwt>
```

---

## 👤 Utilisateurs (Users)

Base URL : `/users`

### 1. Inscription d'un utilisateur

**Endpoint :** `POST /users/`

**Description :** Crée un nouveau compte utilisateur et retourne un token JWT.

**Authentification :** ❌ Non requise

**Body (JSON) :**
```json
{
  "profileName": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "phoneNumber": "+33612345678",
  "password": "MotDePasse123!"
}
```

**Réponse Success (201) :**
```json
{
  "message": "Inscription réussie !",
  "username": "jean_dupont_abc123",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse Erreur (400) :**
```json
{
  "message": "Email déjà utilisé"
}
```

**Explications :**
- Le `username` est généré automatiquement à partir du `profileName`
- Le `password` est hashé avant stockage
- Un token JWT est retourné pour authentification immédiate

---

### 2. Connexion d'un utilisateur

**Endpoint :** `POST /users/login`

**Description :** Authentifie un utilisateur et retourne un token JWT.

**Authentification :** ❌ Non requise

**Body (JSON) :**
```json
{
  "email": "jean.dupont@example.com",
  "password": "MotDePasse123!"
}
```

**Réponse Success (200) :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "usr_abc123",
    "username": "jean_dupont_abc123",
    "email": "jean.dupont@example.com",
    "profileName": "Jean Dupont"
  }
}
```

**Réponse Erreur (401) :**
```json
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}
```

**Explications :**
- Vérifie l'email et le mot de passe
- Retourne un token JWT valide pour 7 jours (par défaut)
- Le token doit être stocké côté client pour les requêtes authentifiées

---

### 3. Récupérer le profil privé (utilisateur connecté)

**Endpoint :** `GET /users/`

**Description :** Récupère les informations complètes de l'utilisateur connecté.

**Authentification :** ✅ Requise

**Headers :**
```
Authorization: Bearer <token>
```

**Réponse Success (200) :**
```json
{
  "success": true,
  "user": {
    "userId": "usr_abc123",
    "username": "jean_dupont_abc123",
    "email": "jean.dupont@example.com",
    "profileName": "Jean Dupont",
    "phoneNumber": "+33612345678",
    "createdAt": "2025-12-04T10:30:00.000Z",
    "updatedAt": "2025-12-04T10:30:00.000Z"
  }
}
```

**Explications :**
- Retourne toutes les informations de l'utilisateur (y compris email et téléphone)
- Utilise le userId extrait du token JWT

---

### 4. Récupérer le profil public d'un utilisateur

**Endpoint :** `GET /users/:username`

**Description :** Récupère les informations publiques d'un utilisateur par son username.

**Authentification :** ❌ Non requise

**Exemple :** `GET /users/jean_dupont_abc123`

**Réponse Success (200) :**
```json
{
  "success": true,
  "user": {
    "username": "jean_dupont_abc123",
    "profileName": "Jean Dupont",
    "createdAt": "2025-12-04T10:30:00.000Z"
  }
}
```

**Réponse Erreur (404) :**
```json
{
  "success": false,
  "message": "Utilisateur non trouvé"
}
```

**Explications :**
- Ne retourne que les informations publiques (pas d'email ni de téléphone)
- Accessible sans authentification

---

### 5. Modifier le profil utilisateur

**Endpoint :** `PATCH /users/`

**Description :** Met à jour les informations de l'utilisateur connecté.

**Authentification :** ✅ Requise

**Headers :**
```
Authorization: Bearer <token>
```

**Body (JSON) - Tous les champs sont optionnels :**
```json
{
  "profileName": "Jean Martin",
  "phoneNumber": "+33687654321",
  "password": "NouveauMotDePasse456!"
}
```

**Réponse Success (200) :**
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "user": {
    "userId": "usr_abc123",
    "username": "jean_dupont_abc123",
    "profileName": "Jean Martin",
    "phoneNumber": "+33687654321",
    "updatedAt": "2025-12-04T15:30:00.000Z"
  }
}
```

**Explications :**
- Seuls les champs fournis sont mis à jour
- Le `password` sera hashé automatiquement
- L'`email` et le `username` ne peuvent pas être modifiés

---

### 6. Supprimer un utilisateur

**Endpoint :** `DELETE /users/`

**Description :** Supprime le compte de l'utilisateur connecté.

**Authentification :** ✅ Requise

**Headers :**
```
Authorization: Bearer <token>
```

**Réponse Success (200) :**
```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès"
}
```

**Réponse Erreur (404) :**
```json
{
  "success": false,
  "message": "Utilisateur non trouvé"
}
```

**Explications :**
- Supprime définitivement le compte utilisateur
- Toutes les vitrines et annonces associées devraient être gérées (à implémenter)

---

## 🏪 Vitrines (Vitrines)

Base URL : `/vitrines`

### 1. Créer une vitrine

**Endpoint :** `POST /vitrines/`

**Description :** Crée une nouvelle vitrine pour l'utilisateur connecté.

**Authentification :** ✅ Requise

**Headers :**
```
Authorization: Bearer <token>
```

**Body (JSON) :**
```json
{
  "name": "Ma Boutique de Vêtements",
  "description": "Vêtements de qualité à petits prix",
  "category": "Mode",
  "logo": "https://example.com/logo.png",
  "banner": "https://example.com/banner.png",
  "contact": {
    "email": "contact@maboutique.com",
    "phone": "+33612345678"
  }
}
```

**Réponse Success (201) :**
```json
{
  "vitrineId": "vtr_xyz789",
  "ownerId": "usr_abc123",
  "slog": "ma-boutique-de-vetements",
  "name": "Ma Boutique de Vêtements",
  "description": "Vêtements de qualité à petits prix",
  "category": "Mode",
  "logo": "https://example.com/logo.png",
  "banner": "https://example.com/banner.png",
  "contact": {
    "email": "contact@maboutique.com",
    "phone": "+33612345678"
  },
  "createdAt": "2025-12-04T11:00:00.000Z",
  "updatedAt": "2025-12-04T11:00:00.000Z"
}
```

**Explications :**
- Le `slog` (slug) est généré automatiquement à partir du `name`
- Le `vitrineId` est généré automatiquement
- Le `ownerId` est extrait du token JWT

---

### 2. Récupérer une vitrine par son slug (Public)

**Endpoint :** `GET /vitrines/:slog`

**Description :** Récupère les informations d'une vitrine par son slug.

**Authentification :** ❌ Non requise

**Exemple :** `GET /vitrines/ma-boutique-de-vetements`

**Réponse Success (200) :**
```json
{
  "success": true,
  "vitrine": {
    "vitrineId": "vtr_xyz789",
    "slog": "ma-boutique-de-vetements",
    "name": "Ma Boutique de Vêtements",
    "description": "Vêtements de qualité à petits prix",
    "category": "Mode",
    "logo": "https://example.com/logo.png",
    "banner": "https://example.com/banner.png",
    "contact": {
      "email": "contact@maboutique.com",
      "phone": "+33612345678",
      "whatsappLink": "https://wa.me/33612345678"
    },
    "createdAt": "2025-12-04T11:00:00.000Z"
  }
}
```

**Réponse Erreur (404) :**
```json
{
  "success": false,
  "message": "Vitrine non trouvée"
}
```

**Explications :**
- Endpoint public pour afficher une vitrine
- Utilisé pour les pages de vitrine côté client
- Le champ `whatsappLink` est généré automatiquement à partir du numéro de téléphone
- Si aucun numéro de téléphone n'est fourni, le champ `whatsappLink` sera `null` ou absent

---

### 3. Récupérer toutes les vitrines du propriétaire

**Endpoint :** `GET /vitrines/my-vitrines`

**Description :** Récupère toutes les vitrines de l'utilisateur connecté.

**Authentification :** ✅ Requise

**Headers :**
```
Authorization: Bearer <token>
```

**Réponse Success (200) :**
```json
{
  "success": true,
  "vitrines": [
    {
      "vitrineId": "vtr_xyz789",
      "slog": "ma-boutique-de-vetements",
      "name": "Ma Boutique de Vêtements",
      "category": "Mode",
      "createdAt": "2025-12-04T11:00:00.000Z"
    },
    {
      "vitrineId": "vtr_abc456",
      "slog": "ma-boutique-electronique",
      "name": "Ma Boutique Électronique",
      "category": "Électronique",
      "createdAt": "2025-12-03T09:00:00.000Z"
    }
  ],
  "count": 2
}
```

**Explications :**
- Retourne uniquement les vitrines appartenant à l'utilisateur connecté
- Utile pour un tableau de bord propriétaire

---

### 4. Modifier une vitrine

**Endpoint :** `PATCH /vitrines/myvitrine/:slog`

**Description :** Met à jour une vitrine appartenant à l'utilisateur connecté.

**Authentification :** ✅ Requise

**Headers :**
```
Authorization: Bearer <token>
```

**Exemple :** `PATCH /vitrines/myvitrine/ma-boutique-de-vetements`

**Body (JSON) - Tous les champs sont optionnels :**
```json
{
  "name": "Ma Nouvelle Boutique",
  "description": "Description mise à jour",
  "category": "Mode & Accessoires"
}
```

**Réponse Success (200) :**
```json
{
  "success": true,
  "message": "Vitrine mise à jour avec succès",
  "vitrine": {
    "vitrineId": "vtr_xyz789",
    "slog": "ma-boutique-de-vetements",
    "name": "Ma Nouvelle Boutique",
    "description": "Description mise à jour",
    "category": "Mode & Accessoires",
    "updatedAt": "2025-12-04T16:00:00.000Z"
  }
}
```

**Réponse Erreur (403) :**
```json
{
  "success": false,
  "message": "Vous n'êtes pas le propriétaire de cette vitrine"
}
```

**Explications :**
- Vérifie que l'utilisateur est bien le propriétaire
- Le `slog` ne peut pas être modifié

---

### 5. Supprimer une vitrine

**Endpoint :** `DELETE /vitrines/myvitrine/:slog`

**Description :** Supprime une vitrine appartenant à l'utilisateur connecté.

**Authentification :** ✅ Requise

**Headers :**
```
Authorization: Bearer <token>
```

**Exemple :** `DELETE /vitrines/myvitrine/ma-boutique-de-vetements`

**Réponse Success (200) :**
```json
{
  "success": true,
  "message": "Vitrine supprimée avec succès"
}
```

**Réponse Erreur (403) :**
```json
{
  "success": false,
  "message": "Vous n'êtes pas le propriétaire de cette vitrine"
}
```

**Explications :**
- Vérifie que l'utilisateur est bien le propriétaire
- Supprime définitivement la vitrine

---

## 📢 Annonces (Annonces)

Base URL : `/annonces`

### 1. Créer une annonce

**Endpoint :** `POST /annonces/annonces`

**Description :** Crée une nouvelle annonce dans une vitrine.

**Authentification :** ✅ Requise

**Headers :**
```
Authorization: Bearer <token>
```

**Body (JSON) :**
```json
{
  "vitrineSlug": "ma-boutique-de-vetements",
  "title": "T-shirt blanc premium",
  "description": "T-shirt 100% coton de qualité supérieure",
  "price": 29.99,
  "images": [
    "https://example.com/tshirt1.jpg",
    "https://example.com/tshirt2.jpg"
  ]
}
```

**Réponse Success (201) :**
```json
{
  "success": true,
  "annonce": {
    "annonceId": "ann_def456",
    "ownerId": "usr_abc123",
    "vitrineId": "vtr_xyz789",
    "vitrineSlug": "ma-boutique-de-vetements",
    "slug": "t-shirt-blanc-premium",
    "title": "T-shirt blanc premium",
    "description": "T-shirt 100% coton de qualité supérieure",
    "price": 29.99,
    "images": [
      "https://example.com/tshirt1.jpg",
      "https://example.com/tshirt2.jpg"
    ],
    "createdAt": "2025-12-04T12:00:00.000Z",
    "updatedAt": "2025-12-04T12:00:00.000Z"
  }
}
```

**Réponse Erreur (403) :**
```json
{
  "success": false,
  "message": "Vous n'êtes pas le propriétaire de cette vitrine"
}
```

**Explications :**
- Vérifie que l'utilisateur est propriétaire de la vitrine
- Le `slug` est généré automatiquement à partir du `title`
- Au moins une image est requise

---

### 2. Récupérer une annonce par son slug

**Endpoint :** `GET /annonces/annonces/:slug`

**Description :** Récupère les détails d'une annonce par son slug.

**Authentification :** ❌ Non requise

**Exemple :** `GET /annonces/annonces/t-shirt-blanc-premium`

**Réponse Success (200) :**
```json
{
  "success": true,
  "annonce": {
    "annonceId": "ann_def456",
    "vitrineSlug": "ma-boutique-de-vetements",
    "slug": "t-shirt-blanc-premium",
    "title": "T-shirt blanc premium",
    "description": "T-shirt 100% coton de qualité supérieure",
    "price": 29.99,
    "images": [
      "https://example.com/tshirt1.jpg",
      "https://example.com/tshirt2.jpg"
    ],
    "createdAt": "2025-12-04T12:00:00.000Z"
  }
}
```

**Réponse Erreur (404) :**
```json
{
  "success": false,
  "message": "Annonce non trouvée"
}
```

---

### 3. Récupérer toutes les annonces d'une vitrine

**Endpoint :** `GET /annonces/vitrines/:vitrineSlug/annonces`

**Description :** Récupère toutes les annonces d'une vitrine spécifique.

**Authentification :** ❌ Non requise

**Exemple :** `GET /annonces/vitrines/ma-boutique-de-vetements/annonces`

**Réponse Success (200) :**
```json
{
  "success": true,
  "vitrineSlug": "ma-boutique-de-vetements",
  "annonces": [
    {
      "annonceId": "ann_def456",
      "slug": "t-shirt-blanc-premium",
      "title": "T-shirt blanc premium",
      "price": 29.99,
      "images": ["https://example.com/tshirt1.jpg"],
      "createdAt": "2025-12-04T12:00:00.000Z"
    },
    {
      "annonceId": "ann_ghi789",
      "slug": "jean-bleu-slim",
      "title": "Jean bleu slim",
      "price": 59.99,
      "images": ["https://example.com/jean1.jpg"],
      "createdAt": "2025-12-04T11:30:00.000Z"
    }
  ],
  "count": 2
}
```

**Explications :**
- Retourne toutes les annonces d'une vitrine
- Utile pour afficher le catalogue d'une vitrine

---

### 4. Modifier une annonce

**Endpoint :** `PATCH /annonces/annonces/:slug`

**Description :** Met à jour une annonce existante.

**Authentification :** ✅ Requise

**Headers :**
```
Authorization: Bearer <token>
```

**Exemple :** `PATCH /annonces/annonces/t-shirt-blanc-premium`

**Body (JSON) - Tous les champs sont optionnels :**
```json
{
  "title": "T-shirt blanc premium - Édition limitée",
  "price": 34.99,
  "description": "T-shirt 100% coton bio - Édition limitée"
}
```

**Réponse Success (200) :**
```json
{
  "success": true,
  "message": "Annonce mise à jour avec succès",
  "annonce": {
    "annonceId": "ann_def456",
    "slug": "t-shirt-blanc-premium",
    "title": "T-shirt blanc premium - Édition limitée",
    "price": 34.99,
    "description": "T-shirt 100% coton bio - Édition limitée",
    "updatedAt": "2025-12-04T17:00:00.000Z"
  }
}
```

**Explications :**
- Vérifie que l'utilisateur est propriétaire de l'annonce
- Le `slug` ne peut pas être modifié

---

### 5. Supprimer une annonce

**Endpoint :** `DELETE /annonces/annonces/:slug`

**Description :** Supprime une annonce existante.

**Authentification :** ✅ Requise

**Headers :**
```
Authorization: Bearer <token>
```

**Exemple :** `DELETE /annonces/annonces/t-shirt-blanc-premium`

**Réponse Success (200) :**
```json
{
  "success": true,
  "message": "Annonce supprimée avec succès"
}
```

**Réponse Erreur (403) :**
```json
{
  "success": false,
  "message": "Vous n'êtes pas le propriétaire de cette annonce"
}
```

---

## 🔍 Feed & Recherche

### 1. Feed d'annonces

**Endpoint :** `GET /annonces/feed`

**Description :** Récupère un feed paginé d'annonces avec options de tri.

**Authentification :** ❌ Non requise

**Query Parameters :**
- `page` (optionnel) - Numéro de page (défaut: 1)
- `limit` (optionnel) - Résultats par page (défaut: 20, max: 100)
- `sortBy` (optionnel) - Tri par: `createdAt`, `price`, `title` (défaut: createdAt)
- `order` (optionnel) - Ordre: `asc`, `desc` (défaut: desc)

**Exemples :**
```
GET /annonces/feed
GET /annonces/feed?page=2&limit=10
GET /annonces/feed?sortBy=price&order=asc
GET /annonces/feed?page=1&limit=20&sortBy=createdAt&order=desc
```

**Réponse Success (200) :**
```json
{
  "success": true,
  "data": [
    {
      "annonceId": "ann_def456",
      "vitrineSlug": "ma-boutique-de-vetements",
      "slug": "t-shirt-blanc-premium",
      "title": "T-shirt blanc premium",
      "description": "T-shirt 100% coton de qualité supérieure",
      "price": 29.99,
      "images": ["https://example.com/tshirt1.jpg"],
      "createdAt": "2025-12-04T12:00:00.000Z"
    },
    {
      "annonceId": "ann_ghi789",
      "vitrineSlug": "ma-boutique-electronique",
      "slug": "smartphone-x100",
      "title": "Smartphone X100",
      "description": "Dernier modèle avec 5G",
      "price": 599.99,
      "images": ["https://example.com/phone1.jpg"],
      "createdAt": "2025-12-04T11:45:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalAnnonces": 95,
    "limit": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Réponse Erreur (400) :**
```json
{
  "success": false,
  "message": "Le champ de tri doit être: createdAt, price ou title"
}
```

**Explications :**
- Retourne toutes les annonces de toutes les vitrines
- Supporte la pagination pour de meilleures performances
- Permet de trier par différents critères
- Utile pour une page d'accueil ou un catalogue général

---

### 2. Recherche d'annonces et vitrines

**Endpoint :** `GET /annonces/search`

**Description :** Recherche dans les annonces et/ou vitrines par mots-clés.

**Authentification :** ❌ Non requise

**Query Parameters :**
- `q` (requis) - Terme de recherche
- `type` (optionnel) - Type: `annonces`, `vitrines`, `all` (défaut: all)
- `page` (optionnel) - Numéro de page (défaut: 1)
- `limit` (optionnel) - Résultats par page (défaut: 20, max: 100)

**Exemples :**
```
GET /annonces/search?q=smartphone
GET /annonces/search?q=vetement&type=annonces
GET /annonces/search?q=boutique&type=vitrines
GET /annonces/search?q=mode&type=all&page=1&limit=10
```

**Réponse Success (200) :**
```json
{
  "success": true,
  "query": "smartphone",
  "type": "all",
  "data": {
    "results": [
      {
        "annonceId": "ann_ghi789",
        "vitrineSlug": "ma-boutique-electronique",
        "slug": "smartphone-x100",
        "title": "Smartphone X100",
        "description": "Dernier modèle avec 5G",
        "price": 599.99,
        "images": ["https://example.com/phone1.jpg"],
        "resultType": "annonce",
        "createdAt": "2025-12-04T11:45:00.000Z"
      },
      {
        "vitrineId": "vtr_abc456",
        "slog": "ma-boutique-electronique",
        "name": "Ma Boutique Électronique",
        "description": "Smartphones et accessoires",
        "category": "Électronique",
        "resultType": "vitrine",
        "createdAt": "2025-12-03T09:00:00.000Z"
      }
    ],
    "counts": {
      "annonces": 15,
      "vitrines": 3,
      "total": 18
    }
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalResults": 18,
    "limit": 20,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

**Réponse Erreur (400) :**
```json
{
  "success": false,
  "message": "Le paramètre de recherche \"q\" est requis"
}
```

**Explications :**
- Recherche dans les titres, descriptions et slugs
- Pour les vitrines, recherche aussi dans la catégorie
- Retourne un mélange d'annonces et vitrines (si `type=all`)
- Chaque résultat a un champ `resultType` pour différencier
- Les compteurs permettent de savoir combien de résultats par type

---

## 🔧 Codes d'erreur HTTP

| Code | Signification | Utilisation |
|------|---------------|-------------|
| 200 | OK | Requête réussie (GET, PATCH, DELETE) |
| 201 | Created | Ressource créée avec succès (POST) |
| 400 | Bad Request | Données invalides ou manquantes |
| 401 | Unauthorized | Token manquant ou invalide |
| 403 | Forbidden | Accès refusé (pas le propriétaire) |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit (ex: email déjà utilisé) |
| 500 | Internal Server Error | Erreur serveur |

---

## 📝 Notes Importantes

1. **Tokens JWT** : Les tokens expirent après 7 jours (configurable)
2. **Slugs** : Générés automatiquement et uniques
3. **IDs** : Tous les IDs sont générés automatiquement
4. **Pagination** : Limite maximale de 100 résultats par page
5. **Images** : Les URLs d'images doivent être fournies (stockage externe)
6. **Dates** : Format ISO 8601 (ex: `2025-12-04T12:00:00.000Z`)
7. **Liens WhatsApp** : Générés automatiquement à partir des numéros de téléphone dans les contacts des vitrines. Format: `https://wa.me/[numéro]`

---

## 🚀 Démarrage Rapide

### 1. Inscription et connexion
```bash
# Inscription
curl -X POST http://localhost:3000/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "profileName": "Test User",
    "email": "test@example.com",
    "phoneNumber": "+33612345678",
    "password": "Test123!"
  }'

# Connexion
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 2. Créer une vitrine
```bash
curl -X POST http://localhost:3000/vitrines/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <votre_token>" \
  -d '{
    "name": "Ma Boutique Test",
    "description": "Description de test",
    "category": "Test"
  }'
```

### 3. Créer une annonce
```bash
curl -X POST http://localhost:3000/annonces/annonces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <votre_token>" \
  -d '{
    "vitrineSlug": "ma-boutique-test",
    "title": "Produit Test",
    "description": "Description du produit",
    "price": 19.99,
    "images": ["https://example.com/image.jpg"]
  }'
```

### 4. Rechercher
```bash
# Feed
curl http://localhost:3000/annonces/feed?limit=5

# Recherche
curl "http://localhost:3000/annonces/search?q=test&type=all"
```

---

**Version :** 1.0  
**Dernière mise à jour :** 2025-12-04
