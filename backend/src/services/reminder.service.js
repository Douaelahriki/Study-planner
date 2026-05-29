const cron = require('node-cron');
const GroupSession = require('../models/GroupSession');
const Notification = require('../models/Notification');

const startReminderJob = () => {
  // Vérifie toutes les minutes
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Récupère toutes les sessions actives
      const sessions = await GroupSession.find({ status: 'active' })
        .populate('participants.userId', 'name');

      for (const session of sessions) {
        // Construire la date+heure complète de la session
        const [hours, minutes] = session.startTime.split(':').map(Number);
        const sessionDateTime = new Date(session.date);
        sessionDateTime.setHours(hours, minutes, 0, 0);

        // Calculer la différence en minutes
        const diffMs = sessionDateTime - now;
        const diffMin = Math.round(diffMs / 60000);

        console.log(`📋 Session: "${session.title}" — commence dans ${diffMin} min`);

        // Envoyer rappel si entre 29 et 31 minutes
        if (diffMin >= 29 && diffMin <= 31) {
          const accepted = session.participants.filter(p => p.status === 'accepted');

          for (const participant of accepted) {
            // Vérifie si rappel déjà envoyé
            const alreadySent = await Notification.findOne({
              userId: participant.userId._id,
              relatedId: session._id,
              type: 'reminder'
            });

            if (!alreadySent) {
              await Notification.create({
                userId: participant.userId._id,
                type: 'reminder',
                title: 'Rappel de session ⏰',
                message: `Ta session "${session.title}" (${session.subject}) commence dans 30 minutes à ${session.startTime} !`,
                isRead: false,
                relatedId: session._id,
                relatedModel: 'Session'
              });

              console.log(`⏰ Rappel envoyé à ${participant.userId.name} pour "${session.title}"`);
            }
          }
        }
      }
    } catch (err) {
      console.error('❌ Erreur reminder job:', err.message);
    }
  });

  console.log('⏰ Reminder job démarré — vérifie toutes les minutes');
};

module.exports = startReminderJob;