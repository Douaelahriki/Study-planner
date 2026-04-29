require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Subject = require('./models/Subject');
const Session = require('./models/Session');
const Group = require('./models/Group');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

const seed = async () => {
  try {
    await connectDB();
    
    console.log('🧹 Nettoyage des collections...');
    await User.deleteMany();
    await Subject.deleteMany();
    await Session.deleteMany();
    await Group.deleteMany();
    await Message.deleteMany();
    await Notification.deleteMany();
    
    console.log('👤 Création des utilisateurs...');
    const admin = await User.create({
      name: 'Admin Test',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });
    
    const lahrik = await User.create({
      name: 'Lahrik',
      email: 'lahrik@test.com',
      password: 'password123',
      availability: [
        { day: 'monday', startTime: '18:00', endTime: '20:00' },
        { day: 'wednesday', startTime: '14:00', endTime: '17:00' },
        { day: 'saturday', startTime: '09:00', endTime: '12:00' }
      ]
    });
    
    const douae = await User.create({
      name: 'Douae',
      email: 'douae@test.com',
      password: 'password123',
      availability: [
        { day: 'tuesday', startTime: '17:00', endTime: '19:00' },
        { day: 'thursday', startTime: '14:00', endTime: '18:00' }
      ]
    });
    
    console.log('📚 Création des matières...');
    const math = await Subject.create({
      userId: lahrik._id,
      name: 'Mathématiques',
      priority: 5,
      weeklyGoalHours: 10,
      color: '#EF4444'
    });
    
    const angular = await Subject.create({
      userId: lahrik._id,
      name: 'Angular',
      priority: 4,
      weeklyGoalHours: 8,
      color: '#3B82F6'
    });
    
    await Subject.create({
      userId: douae._id,
      name: 'Node.js',
      priority: 5,
      weeklyGoalHours: 12,
      color: '#10B981'
    });
    
    console.log('📅 Création des sessions...');
    await Session.create({
      userId: lahrik._id,
      subjectId: math._id,
      title: 'Révision Algèbre Linéaire',
      date: new Date(),
      startTime: '18:00',
      endTime: '20:00',
      duration: 120,
      status: 'planned'
    });
    
    await Session.create({
      userId: lahrik._id,
      subjectId: angular._id,
      title: 'Formation Angular Routing',
      date: new Date(),
      startTime: '14:00',
      endTime: '16:00',
      duration: 120,
      status: 'completed',
      actualDuration: 110
    });
    
    console.log('👥 Création des groupes...');
    const group = await Group.create({
      name: 'Étude Web Dev',
      description: 'Groupe pour préparer le projet final',
      owner: lahrik._id,
      members: [lahrik._id, douae._id]
    });
    
    console.log('💬 Création des messages...');
    await Message.create({
      groupId: group._id,
      senderId: lahrik._id,
      content: 'Salut Douae ! Prête pour la session demain ?',
      type: 'text'
    });
    
    await Message.create({
      groupId: group._id,
      senderId: douae._id,
      content: 'Oui ! On commence à 14h ?',
      type: 'text'
    });
    
    console.log('🔔 Création des notifications...');
    await Notification.create({
      userId: lahrik._id,
      type: 'reminder',
      title: 'Session bientôt !',
      message: 'Ta session de Maths commence dans 30 minutes',
      isRead: false
    });
    
    await Notification.create({
      userId: douae._id,
      type: 'invitation',
      title: 'Nouvelle invitation',
      message: 'Lahrik t\'a invité dans le groupe "Étude Web Dev"',
      isRead: false
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DONNÉES DE TEST CRÉÉES AVEC SUCCÈS !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 COMPTES DE TEST :');
    console.log('   Admin  : admin@test.com  / admin123');
    console.log('   User 1 : lahrik@test.com / password123');
    console.log('   User 2 : douae@test.com  / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error.message);
    process.exit(1);
  }
};

seed();