const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createAdmin,
  deleteUser,
  getGlobalStats,
  getWeeklyProductivity
} = require('../controllers/admin.controller');

const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

// Statistiques globales
router.get('/stats', getGlobalStats);
router.get('/stats/weekly', getWeeklyProductivity);   // ← NOUVEAU

// Gestion des utilisateurs
router.get('/users', getAllUsers);
router.post('/users', createAdmin);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

module.exports = router;