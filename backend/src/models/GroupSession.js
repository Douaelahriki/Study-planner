const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'refused'], default: 'pending' },
  respondedAt: { type: Date, default: null }
}, { _id: false });

const groupSessionSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 200 },
  subject: { type: String, required: true, maxlength: 100 },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  duration: { type: Number, required: true, min: 15 },
  participants: [participantSchema],
  comments: [commentSchema],
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('GroupSession', groupSessionSchema);