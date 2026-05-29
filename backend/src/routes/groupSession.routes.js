const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createGroupSession, getGroupSessions,
  respondToSession, addComment
} = require('../controllers/groupSession.controller');

router.use(protect);

router.post('/', createGroupSession);
router.get('/group/:groupId', getGroupSessions);
router.put('/:id/respond', respondToSession);
router.post('/:id/comments', addComment);

module.exports = router;