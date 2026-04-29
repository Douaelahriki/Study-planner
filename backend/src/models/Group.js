const mongoose = require('mongoose');

/**
 * Sous-schéma : invitations
 */
const invitationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'refused'],
    default: 'pending'
  },
  invitedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

/**
 * Schéma Group (groupe d'étude)
 */
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du groupe est obligatoire'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  invitations: [invitationSchema],
  isPrivate: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', groupSchema);