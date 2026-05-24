const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateMe,
  updateAvailability
} = require('../controllers/auth.controller');

const { protect } = require('../middleware/auth.middleware');

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes privées
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/availability', protect, updateAvailability);

module.exports = router;