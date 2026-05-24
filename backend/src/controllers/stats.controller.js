const Session = require('../models/Session');
const Subject = require('../models/Subject');

// GET /api/stats/summary — résumé global
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalSessions = await Session.countDocuments({ userId });
    const completedSessions = await Session.countDocuments({ userId, status: 'completed' });
    const missedSessions = await Session.countDocuments({ userId, status: 'missed' });

    const completedDocs = await Session.find({ userId, status: 'completed' });
    const totalMinutes = completedDocs.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);

    res.json({
      success: true,
      data: {
        totalSessions,
        completedSessions,
        missedSessions,
        totalHours: Math.round(totalMinutes / 60 * 10) / 10,
        completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/stats/by-subject — temps par matière
const getBySubject = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const subjects = await Subject.find({ userId });

    const stats = await Promise.all(subjects.map(async (subject) => {
      const sessions = await Session.find({
        userId,
        subjectId: subject._id,
        status: 'completed'
      });

      const totalMinutes = sessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);
      const goalMinutes = subject.weeklyGoalHours * 60;

      return {
        subjectId: subject._id,
        name: subject.name,
        color: subject.color,
        totalHours: Math.round(totalMinutes / 60 * 10) / 10,
        goalHours: subject.weeklyGoalHours,
        progress: goalMinutes > 0 ? Math.min(Math.round((totalMinutes / goalMinutes) * 100), 100) : 0,
        sessionsCount: sessions.length
      };
    }));

    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

// GET /api/stats/weekly — productivité des 7 derniers jours
const getWeekly = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const sessions = await Session.find({
        userId,
        date: { $gte: date, $lt: nextDate }
      });

      const planned = sessions.filter(s => ['planned', 'completed', 'missed'].includes(s.status)).length;
      const completed = sessions.filter(s => s.status === 'completed').length;
      const totalMinutes = sessions
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);

      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        planned,
        completed,
        hours: Math.round(totalMinutes / 60 * 10) / 10
      });
    }

    res.json({ success: true, data: days });
  } catch (err) {
    next(err);
  }
};

// GET /api/stats/comparison — prévu vs réalisé
const getComparison = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const subjects = await Subject.find({ userId });

    const data = await Promise.all(subjects.map(async (subject) => {
      const planned = await Session.countDocuments({ userId, subjectId: subject._id });
      const completed = await Session.countDocuments({ userId, subjectId: subject._id, status: 'completed' });

      const plannedMinutes = (await Session.find({ userId, subjectId: subject._id }))
        .reduce((sum, s) => sum + s.duration, 0);
      const actualMinutes = (await Session.find({ userId, subjectId: subject._id, status: 'completed' }))
        .reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);

      return {
        name: subject.name,
        color: subject.color,
        plannedSessions: planned,
        completedSessions: completed,
        plannedHours: Math.round(plannedMinutes / 60 * 10) / 10,
        actualHours: Math.round(actualMinutes / 60 * 10) / 10
      };
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getBySubject, getWeekly, getComparison };