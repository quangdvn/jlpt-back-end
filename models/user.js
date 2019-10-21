const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const tryExamSchema = new mongoose.Schema({
  recentTry: {
    type: Date
  },
  completed: {
    type: Boolean
  },
  highestScore: {
    type: Number
  }
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    fullname: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    googleId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true
    },
    facebookId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
    avatar: {
      type: String,
      default: undefined
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    tryExams: {
      type: [tryExamSchema]
    }
  },
  { timestamps: true, collection: 'users' }
);

//* Middleware before creating new user
userSchema.pre('save', async function(next) {
  let user = this;
  //* only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

//* Some Utils func
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: 3600 }
  );
  return token;
};

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

function validateNewUser(user) {
  const schema = Joi.object({
    username: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    fullname: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    re_password: Joi.ref('password'),
    isAdmin: Joi.bool()
  });
  return schema.validate(user);
}

function validateCurUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  });
  return schema.validate(user);
}

exports.User = User;
exports.validateRegister = validateNewUser;
exports.validateAuth = validateCurUser;
