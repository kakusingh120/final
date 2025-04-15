// Case.js - auto-generated
const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer' },
  caseType: {
    type: String,
    enum: ['FIR', 'civil', 'criminal', 'family', 'property', 'consumer', 'PIL']
  },
  title: String,
  description: String,
  status: { type: String, enum: ['draft', 'filed', 'in progress', 'closed'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);
