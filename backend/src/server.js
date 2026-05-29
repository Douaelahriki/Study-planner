require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error.middleware');
const initSocket = require('./socket/socket');
const startReminderJob = require('./services/reminder.service');
require('./models/User');
require('./models/Subject');
require('./models/Session');
require('./models/Group');
require('./models/Message');
require('./models/Notification');
require('./models/GroupSession');
const app = express();
const httpServer = http.createServer(app);

connectDB();
 startReminderJob();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4200',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.originalUrl}`);
    next();
  });
}

app.get('/', (req, res) => {
  res.json({ success: true, message: '🚀 API Study Planner fonctionne !', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'OK', uptime: process.uptime() });
});

// Routes binome
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/subjects', require('./routes/subject.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/availability', require('./routes/availability.routes'));
app.use('/api/group-sessions', require('./routes/groupSession.routes'));

// Routes Douae
app.use('/api/groups', require('./routes/group.routes'));
app.use('/api/messages', require('./routes/message.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/stats', require('./routes/stats.routes'));

app.use(notFound);
app.use(errorHandler);

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