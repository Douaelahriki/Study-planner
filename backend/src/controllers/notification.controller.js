const Notification = require('../models/Notification');

// GET /api/notifications — mes notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/:id/read — marquer lue
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification non trouvée' });
    }

    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/read-all — tout marquer lu
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notifications/:id — supprimer
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification non trouvée' });
    }

    res.json({ success: true, message: 'Notification supprimée' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };