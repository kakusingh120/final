// ChatHistory.js - auto-generated
const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  message: String,
  from: { type: String, enum: ['user', 'ai'] },
  responseType: { type: String, enum: ['text', 'document', 'action'] }
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
