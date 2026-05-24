const Group = require('../models/Group');
const User = require('../models/User');
const Notification = require('../models/Notification');

// GET /api/groups — mes groupes
const getMyGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: groups });
  } catch (err) {
    next(err);
  }
};

// POST /api/groups — créer un groupe
const createGroup = async (req, res, next) => {
  try {
    const { name, description, isPrivate } = req.body;

    const group = await Group.create({
      name,
      description,
      isPrivate,
      owner: req.user._id,
      members: [req.user._id]
    });

    await group.populate('owner', 'name email avatar');

    res.status(201).json({ success: true, data: group });
  } catch (err) {
    next(err);
  }
};

// GET /api/groups/:id — détail d'un groupe
const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate('invitations.userId', 'name email');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Groupe non trouvé' });
    }

    // Vérifier que l'utilisateur est membre
    const isMember = group.members.some(m => m._id.toString() === req.user._id.toString());
    const isOwner = group.owner._id.toString() === req.user._id.toString();

    if (!isMember && !isOwner) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    res.json({ success: true, data: group });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/groups/:id — supprimer un groupe
const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Groupe non trouvé' });
    }

    if (group.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Seul le créateur peut supprimer' });
    }

    await group.deleteOne();
    res.json({ success: true, message: 'Groupe supprimé' });
  } catch (err) {
    next(err);
  }
};

// POST /api/groups/:id/invite — inviter un membre
const inviteMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Groupe non trouvé' });
    }

    if (group.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Seul le créateur peut inviter' });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Déjà membre ?
    if (group.members.includes(userToInvite._id)) {
      return res.status(400).json({ success: false, message: 'Déjà membre du groupe' });
    }

    // Déjà invité ?
    const alreadyInvited = group.invitations.find(
      inv => inv.userId.toString() === userToInvite._id.toString() && inv.status === 'pending'
    );
    if (alreadyInvited) {
      return res.status(400).json({ success: false, message: 'Invitation déjà envoyée' });
    }

    group.invitations.push({ userId: userToInvite._id, status: 'pending' });
    await group.save();

    // Créer une notification
    await Notification.create({
      userId: userToInvite._id,
      type: 'invitation',
      title: 'Nouvelle invitation',
      message: `${req.user.name} t'a invité dans le groupe "${group.name}"`,
      isRead: false,
      relatedId: group._id,
      relatedModel: 'Group'
    });

    res.json({ success: true, message: 'Invitation envoyée' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/groups/:id/respond — accepter ou refuser
const respondInvitation = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' ou 'refused'
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Groupe non trouvé' });
    }

    const invitation = group.invitations.find(
      inv => inv.userId.toString() === req.user._id.toString() && inv.status === 'pending'
    );

    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation non trouvée' });
    }

    invitation.status = status;

    if (status === 'accepted') {
      group.members.push(req.user._id);
    }

    await group.save();

    res.json({ success: true, message: status === 'accepted' ? 'Vous avez rejoint le groupe' : 'Invitation refusée' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyGroups, createGroup, getGroupById, deleteGroup, inviteMember, respondInvitation };