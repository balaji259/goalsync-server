const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' },
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);

