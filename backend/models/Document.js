// Document.js - auto-generated
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  name: String,
  type: { type: String, enum: ['FIR', 'contract', 'court notice', 'others'] },
  url: String,
  uploadDate: Date,
  summary: String,
  plainText: String,
  simplifiedByAI: Boolean
});

module.exports = mongoose.model('Document', documentSchema);
