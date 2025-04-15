// ConnectedAid.js - auto-generated
const mongoose = require('mongoose');

const connectedAidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['lawyer', 'ngo'] },
  name: String,
  email: String,
  phone: String,
  matchedOn: Date
});

module.exports = mongoose.model('ConnectedAid', connectedAidSchema);
