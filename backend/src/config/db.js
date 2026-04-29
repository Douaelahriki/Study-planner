const mongoose = require('mongoose');

/**
 * Connexion à MongoDB Atlas
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    console.log(`📁 Base de données : ${conn.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      console.error(`❌ Erreur MongoDB : ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB déconnecté');
    });
    
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;