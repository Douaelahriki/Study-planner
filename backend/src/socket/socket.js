const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Group = require('../models/Group');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:4200',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware auth Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Token manquant'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('Utilisateur non trouvé'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Token invalide'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connecté : ${socket.user.name}`);

    // Rejoindre les rooms des groupes
    socket.on('join-group', (groupId) => {
      socket.join(`group:${groupId}`);
      console.log(`${socket.user.name} a rejoint group:${groupId}`);
    });

    // Quitter une room
    socket.on('leave-group', (groupId) => {
      socket.leave(`group:${groupId}`);
    });

    // Envoyer un message
    socket.on('send-message', async (data) => {
      try {
        const { groupId, content, type, sessionId } = data;

        // Vérifier que l'user est membre
        const group = await Group.findById(groupId);
        if (!group) return;

        const isMember = group.members.some(m => m.toString() === socket.user._id.toString());
        if (!isMember) return;

        // Sauvegarder en BDD
        const message = await Message.create({
          groupId,
          senderId: socket.user._id,
          content,
          type: type || 'text',
          sessionId: sessionId || null
        });

        await message.populate('senderId', 'name avatar');

        // Diffuser à tous les membres du groupe
        io.to(`group:${groupId}`).emit('new-message', {
          success: true,
          data: message
        });

      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    // Typing indicator
    socket.on('typing', (groupId) => {
      socket.to(`group:${groupId}`).emit('user-typing', {
        userId: socket.user._id,
        name: socket.user.name
      });
    });

    socket.on('stop-typing', (groupId) => {
      socket.to(`group:${groupId}`).emit('user-stop-typing', {
        userId: socket.user._id
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket déconnecté : ${socket.user.name}`);
    });
  });

  return io;
};

module.exports = initSocket;