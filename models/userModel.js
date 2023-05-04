const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true
  },
  role: {
    type: String,
    required: [true, 'A user must have a role']
  },
  active: {
    type: Boolean,
    default: false
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password']
  }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
