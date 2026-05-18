const express = require('express');
const router = express.Router();

const {
  getMyAvailability,
  addAvailability,
  updateAvailability,
  deleteAvailability,
  setAllAvailability
} = require('../controllers/availability.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getMyAvailability);
router.post('/', addAvailability);
router.put('/', setAllAvailability);
router.put('/:index', updateAvailability);
router.delete('/:index', deleteAvailability);

module.exports = router;