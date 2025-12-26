const AnnonceModel = require('../../models/annonceModel');

class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundError extends APIError {
  constructor(message = 'Ressource introuvable') {
    super(message, 404);
  }
}

class ForbiddenError extends APIError {
  constructor(message = 'Accès refusé') {
    super(message, 403);
  }
}

const deleteAnnonceService = async (slug, userId) => {
  const annonce = await AnnonceModel.findBySlug(slug);
  if (!annonce) throw new NotFoundError("Annonce introuvable.");

  if (annonce.ownerId !== userId) {
    throw new ForbiddenError("Accès refusé.");
  }

  return AnnonceModel.delete(slug);
};

module.exports = {
  deleteAnnonceService,
  NotFoundError,
  ForbiddenError,
  APIError
};
