const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protège les routes : vérifie le JWT
 */
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé. Token manquant'
    });
  }
};

/**
 * Réservé aux admins (à utiliser après protect)
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Accès refusé. Réservé aux administrateurs'
    });
  }
};

module.exports = { protect, adminOnly };