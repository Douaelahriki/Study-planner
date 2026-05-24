const Message = require('../models/Message');
const Group = require('../models/Group');

// GET /api/groups/:id/messages — messages du chat
const getMessages = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Groupe non trouvé' });
    }

    const isMember = group.members.some(m => m.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ groupId: req.params.id })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ success: true, data: messages.reverse() });
  } catch (err) {
    next(err);
  }
};

// POST /api/groups/:id/messages — envoyer un message (HTTP fallback)
const sendMessage = async (req, res, next) => {
  try {
    const { content, type, sessionId } = req.body;

    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Groupe non trouvé' });
    }

    const isMember = group.members.some(m => m.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const message = await Message.create({
      groupId: req.params.id,
      senderId: req.user._id,
      content,
      type: type || 'text',
      sessionId: sessionId || null
    });

    await message.populate('senderId', 'name avatar');

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMessages, sendMessage };