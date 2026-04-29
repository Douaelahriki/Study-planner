const mongoose = require('mongoose');

/**
 * Schéma Subject (matière/projet)
 */
const subjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Le nom de la matière est obligatoire'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  priority: {
    type: Number,
    required: true,
    min: [1, 'Priorité minimum : 1'],
    max: [5, 'Priorité maximum : 5'],
    default: 3
  },
  weeklyGoalHours: {
    type: Number,
    required: true,
    min: 0,
    max: 60,
    default: 5
  },
  color: {
    type: String,
    default: '#3B82F6',
    match: [/^#([A-Fa-f0-9]{6})$/, 'Couleur hex invalide']
  },
  maxSessionDuration: {
    type: Number,
    default: 120,
    min: 15,
    max: 480
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);