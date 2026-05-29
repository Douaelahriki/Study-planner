const GroupSession = require('../models/GroupSession');
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const User = require('../models/User');

// POST /api/group-sessions — créer et partager une session
const createGroupSession = async (req, res, next) => {
  try {
    const { groupId, title, subject, date, startTime, duration } = req.body;

    const group = await Group.findById(groupId).populate('members', 'name');
    if (!group) return res.status(404).json({ success: false, message: 'Groupe non trouvé' });

    const isMember = group.members.some(m => m._id.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ success: false, message: 'Accès refusé' });

    // Créer les participants (tous les membres sauf le créateur)
    const participants = group.members
      .filter(m => m._id.toString() !== req.user._id.toString())
      .map(m => ({ userId: m._id, status: 'pending' }));

    // Ajouter le créateur comme accepted
    participants.push({ userId: req.user._id, status: 'accepted' });

    const session = await GroupSession.create({
      groupId, createdBy: req.user._id,
      title, subject, date, startTime, duration,
      participants
    });

    await session.populate([
      { path: 'createdBy', select: 'name avatar' },
      { path: 'participants.userId', select: 'name avatar' }
    ]);

    // Notifications pour tous les membres
    const notifPromises = group.members
      .filter(m => m._id.toString() !== req.user._id.toString())
      .map(m => Notification.create({
        userId: m._id,
        type: 'session_completed',
        title: 'Nouvelle session partagée',
        message: `${req.user.name} a partagé une session "${title}" dans le groupe "${group.name}"`,
        isRead: false,
        relatedId: session._id,
        relatedModel: 'Session'
      }));

    await Promise.all(notifPromises);

    res.status(201).json({ success: true, data: session });
  } catch (err) { next(err); }
};

// GET /api/group-sessions/group/:groupId — sessions d'un groupe
const getGroupSessions = async (req, res, next) => {
  try {
    const sessions = await GroupSession.find({
      groupId: req.params.groupId,
      status: 'active'
    })
      .populate('createdBy', 'name avatar')
      .populate('participants.userId', 'name avatar')
      .populate('comments.userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: sessions });
  } catch (err) { next(err); }
};

// PUT /api/group-sessions/:id/respond — participer ou refuser
const respondToSession = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' ou 'refused'
    const session = await GroupSession.findById(req.params.id);

    if (!session) return res.status(404).json({ success: false, message: 'Session non trouvée' });

    const participant = session.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (!participant) {
      // Ajouter comme nouveau participant
      session.participants.push({ userId: req.user._id, status, respondedAt: new Date() });
    } else {
      participant.status = status;
      participant.respondedAt = new Date();
    }

    await session.save();
    await session.populate([
      { path: 'createdBy', select: 'name avatar' },
      { path: 'participants.userId', select: 'name avatar' }
    ]);

    // Notifier le créateur
    await Notification.create({
      userId: session.createdBy,
      type: 'session_completed',
      title: status === 'accepted' ? 'Nouveau participant !' : 'Invitation refusée',
      message: `${req.user.name} a ${status === 'accepted' ? 'rejoint' : 'refusé'} votre session "${session.title}"`,
      isRead: false,
      relatedId: session._id
    });

    res.json({ success: true, data: session });
  } catch (err) { next(err); }
};

// POST /api/group-sessions/:id/comments — ajouter un commentaire
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const session = await GroupSession.findById(req.params.id);

    if (!session) return res.status(404).json({ success: false, message: 'Session non trouvée' });

    session.comments.push({ userId: req.user._id, content });
    await session.save();
    await session.populate('comments.userId', 'name avatar');

    const newComment = session.comments[session.comments.length - 1];
    res.status(201).json({ success: true, data: newComment });
  } catch (err) { next(err); }
};

module.exports = { createGroupSession, getGroupSessions, respondToSession, addComment };