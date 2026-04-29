/**
 * Middleware de gestion des erreurs globales
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur :', err.message);
  
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur serveur interne';
  
  // ID Mongoose invalide
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID invalide';
  }
  
  // Duplication (ex: email déjà utilisé)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Ce ${field} est déjà utilisé`;
  }
  
  // Validation Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
  }
  
  // JWT invalide
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token invalide';
  }
  
  // JWT expiré
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expiré';
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée : ${req.originalUrl}`
  });
};

module.exports = { errorHandler, notFound };