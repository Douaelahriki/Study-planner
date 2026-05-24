const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getMyGroups, createGroup, getGroupById,
  deleteGroup, inviteMember, respondInvitation
} = require('../controllers/group.controller');
const { getMessages, sendMessage } = require('../controllers/message.controller');

router.use(protect); // toutes les routes protégées

router.get('/', getMyGroups);
router.post('/', createGroup);
router.get('/:id', getGroupById);
router.delete('/:id', deleteGroup);
router.post('/:id/invite', inviteMember);
router.put('/:id/respond', respondInvitation);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);

module.exports = router;