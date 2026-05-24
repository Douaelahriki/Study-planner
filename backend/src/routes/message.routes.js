const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getMessages, sendMessage } = require('../controllers/message.controller');

router.use(protect);

// Ces routes sont aussi accessibles via /api/groups/:id/messages
// Ici on les garde pour accès direct si besoin
router.get('/group/:groupId', getMessages);
router.post('/group/:groupId', sendMessage);

module.exports = router;