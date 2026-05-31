require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { errorHandler, notFound } = require('./middleware/error.middleware');

require('./models/User');
require('./models/Subject');
require('./models/Session');
require('./models/Group');
require('./models/Message');
require('./models/Notification');
require('./models/GroupSession');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4200',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ success: true, message: '🚀 API Study Planner fonctionne !' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'OK', uptime: process.uptime() });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/subjects', require('./routes/subject.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/availability', require('./routes/availability.routes'));
app.use('/api/group-sessions', require('./routes/groupSession.routes'));
app.use('/api/groups', require('./routes/group.routes'));
app.use('/api/messages', require('./routes/message.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/stats', require('./routes/stats.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;