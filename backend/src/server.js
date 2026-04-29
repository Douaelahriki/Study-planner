require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// 🔥 Importer tous les modèles pour qu'ils soient enregistrés dans Mongoose
require('./models/User');
require('./models/Subject');
require('./models/Session');
require('./models/Group');
require('./models/Message');
require('./models/Notification');

const app = express();

// ============================================
// 🗄️  CONNEXION BDD
// ============================================
connectDB();

// ============================================
// 🛡️  MIDDLEWARES
// ============================================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4200',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger en dev
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ============================================
// 🛣️  ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API Study Planner fonctionne !',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    uptime: process.uptime(),
    models: ['User', 'Subject', 'Session', 'Group', 'Message', 'Notification']
  });
});

// 📍 ROUTES TOI (à décommenter quand tu les crées)
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/subjects', require('./routes/subject.routes'));
// app.use('/api/sessions', require('./routes/session.routes'));
// app.use('/api/admin', require('./routes/admin.routes'));

// 📍 ROUTES DOUAE (à décommenter quand elle les crée)
// app.use('/api/groups', require('./routes/group.routes'));
// app.use('/api/messages', require('./routes/message.routes'));
// app.use('/api/notifications', require('./routes/notification.routes'));
// app.use('/api/stats', require('./routes/stats.routes'));

// ============================================
// ❌ ERREURS
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// 🚀 LANCEMENT
// ============================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  console.log(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

process.on('unhandledRejection', (err) => {
  console.error(`❌ Erreur non gérée : ${err.message}`);
  process.exit(1);
});