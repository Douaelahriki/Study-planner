const express = require('express');
const router = express.Router();

const {
  getMySessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  completeSession,
  missSession,
  getSessionsStats,
  analyzeMyPlanning,
  generateMyPlanning
} = require('../controllers/session.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getMySessions);
router.post('/', createSession);
router.get('/stats', getSessionsStats);
router.get('/analyze', analyzeMyPlanning);          // ← NOUVEAU
router.post('/generate', generateMyPlanning);       // ← NOUVEAU
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);
router.put('/:id/complete', completeSession);
router.put('/:id/miss', missSession);

module.exports = router;