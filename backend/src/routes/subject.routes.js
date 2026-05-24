const express = require('express');
const router = express.Router();

const {
  getMySubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStats
} = require('../controllers/subject.controller');

const { protect } = require('../middleware/auth.middleware');

// Toutes les routes nécessitent d'être connecté
router.use(protect);

router.get('/', getMySubjects);
router.post('/', createSubject);
router.get('/:id', getSubjectById);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);
router.get('/:id/stats', getSubjectStats);

module.exports = router;