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
      minlength: 5,
      maxlength: 50,
      unique: true,
      sparse: true
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
      unique: true,
      sparse: true
    },
    contactNumber: {
      type: String,
      default: undefined,
      maxlength: 11
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
      default: '',
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
    { expiresIn: '12h' }
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
      .trim()
      .regex(/^\S+$/)
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

function validateNewBlueprint(user) {
  const schema = Joi.object({
    username: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .required(),
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

function validateUpdateUser(user) {
  const schema = Joi.object({
    fullname: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .required(),
    contactNumber: Joi.string()
      .max(11)
      .trim()
      .regex(/^[0-9]{7,10}$/)
      .required()
  });
  return schema.validate(user);
}

function validateUpdatePassword(user) {
  const schema = Joi.object({
    oldPassword: Joi.string()
      .min(5)
      .max(255)
      .required(),
    newPassword: Joi.string()
      .min(5)
      .max(255)
      .required()
  });
  return schema.validate(user);
}

exports.User = User;
exports.validateRegister = validateNewUser;
exports.validateBlueprint = validateNewBlueprint;
exports.validateAuth = validateCurUser;
exports.validateUpdateUser = validateUpdateUser;
exports.validateUpdatePassword = validateUpdatePassword;
