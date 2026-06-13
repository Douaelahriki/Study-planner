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

// GET /api/groups/:id/members-sessions — sessions de tous les membres
router.get('/:id/members-sessions', async (req, res, next) => {
  try {
    const Session = require('../models/Session');
    const group = await require('../models/Group').findById(req.params.id).populate('members', 'name email');
    
    if (!group) return res.status(404).json({ success: false, message: 'Groupe non trouvé' });

    const memberIds = group.members.map(m => m._id);
    
    const sessions = await Session.find({
      userId: { $in: memberIds },
      date: { $gte: new Date() }
    })
    .populate('userId', 'name')
    .populate('subjectId', 'name color')
    .sort({ date: 1 })
    .limit(50);

    res.json({ success: true, data: sessions });
  } catch (err) { next(err); }
});