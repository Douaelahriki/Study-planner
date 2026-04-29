const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Sous-schéma : disponibilités hebdomadaires
 */
const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  startTime: { 
    type: String, 
    required: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM requis']
  },
  endTime: { 
    type: String, 
    required: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM requis']
  }
}, { _id: false });

/**
 * Schéma User
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le nom ne peut dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  availability: [availabilitySchema],
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Hasher le password avant sauvegarde (version Mongoose 8+)
userSchema.pre('save', async function() {
  // Si le password n'a pas été modifié, on ne le hash pas
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer un password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);