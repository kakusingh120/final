// CaseNote.js - auto-generated
const mongoose = require('mongoose');

const caseNoteSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CaseNote', caseNoteSchema);
