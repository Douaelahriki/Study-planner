const Session = require('../models/Session');
const Subject = require('../models/Subject');
const Notification = require('../models/Notification');

const checkGoalReached = async (userId, subjectId) => {
  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) return;

    // Début de la semaine il y a 7 jours (pour couvrir semaine précédente)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const sessions = await Session.find({
      userId,
      subjectId,
      status: 'completed',
      date: { $gte: sevenDaysAgo }
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);
    const totalHours = totalMinutes / 60;
    const goalHours = subject.weeklyGoalHours;

    console.log(`🎯 ${subject.name}: ${totalHours}h / ${goalHours}h`);

    if (totalHours >= goalHours) {
      const alreadySent = await Notification.findOne({
        userId,
        type: 'goal_reached',
        createdAt: { $gte: sevenDaysAgo },
        message: { $regex: subject.name }
      });

      if (!alreadySent) {
        await Notification.create({
          userId,
          type: 'goal_reached',
          title: '🎯 Objectif atteint !',
          message: `Bravo ! Tu as atteint ton objectif de ${goalHours}h pour "${subject.name}" cette semaine !`,
          isRead: false
        });
        console.log(`🎯 Objectif atteint pour ${subject.name} !`);
      }
    }
  } catch (err) {
    console.error('❌ Erreur checkGoal:', err.message);
  }
};

module.exports = checkGoalReached;