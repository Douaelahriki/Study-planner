const express = require('express');
const router = express.Router();
 
const { getSummary, getBySubject, getWeekly, getComparison } = require('../controllers/stats.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
router.use(protect);

router.get('/summary', getSummary);
router.get('/by-subject', getBySubject);
router.get('/weekly', getWeekly);
router.get('/comparison', getComparison);
router.get('/admin/global', adminOnly, async (req, res, next) => {
  try {
    const User = require('../models/User');
    const Session = require('../models/Session');
    const Group = require('../models/Group');

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSessions = await Session.countDocuments();
    const completedSessions = await Session.countDocuments({ status: 'completed' });
    const missedSessions = await Session.countDocuments({ status: 'missed' });
    const plannedSessions = await Session.countDocuments({ status: 'planned' });
    const totalGroups = await Group.countDocuments();

    const completedDocs = await Session.find({ status: 'completed' });
    const totalMinutes = completedDocs.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);

    // Productivité hebdomadaire globale
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const daySessions = await Session.find({ date: { $gte: date, $lt: nextDate } });
      const dayCompleted = daySessions.filter(s => s.status === 'completed');
      const dayMinutes = dayCompleted.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);

      weeklyData.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        planned: daySessions.length,
        completed: dayCompleted.length,
        hours: Math.round(dayMinutes / 60 * 10) / 10
      });
    }

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSessions,
        completedSessions,
        missedSessions,
        plannedSessions,
        totalGroups,
        totalHours: Math.round(totalMinutes / 60 * 10) / 10,
        completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
        weeklyData
      }
    });
  } catch (err) {
    next(err);
  }
});
module.exports = router;