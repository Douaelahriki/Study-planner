require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');
const initSocket = require('./socket/socket');
const startReminderJob = require('./services/reminder.service');
const app = require('./app');

const httpServer = http.createServer(app);

connectDB();
startReminderJob();

const io = initSocket(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  console.log(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.io activé`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

process.on('unhandledRejection', (err) => {
  console.error(`❌ Erreur non gérée : ${err.message}`);
  process.exit(1);
});