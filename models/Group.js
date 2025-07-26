const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  type: { type: String, enum: ['public', 'private', 'approval'], default: 'public' },
  joinCode: { type: String },
  maxMembers: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
  goals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Goal" }] 
});

module.exports = mongoose.model('Group', groupSchema);
