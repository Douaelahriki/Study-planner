const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const User = require('../models/User');
const Session = require('../models/Session');

router.use(protect, adminOnly);

// GET /api/admin/users — tous les utilisateurs
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
});

// DELETE /api/admin/users/:id — supprimer un user
router.delete('/users/:id', async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (err) { next(err); }
});

// PUT /api/admin/users/:id/role — changer le rôle
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

module.exports = router;