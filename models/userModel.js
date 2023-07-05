const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

//name, email, photo, password passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must contain a name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'A user must contain an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    required: false,
    unique: false,
    default: ''
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Please provide a password with at least 8 characters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must contain a password'],
    minlength: [8, 'Please provide a password with at least 8 characters'],
    //This only works on create and save
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  }
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);
module.exports = User;
