const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { partSchema } = require('./part');
const { skillSchema } = require('./skill');
const autoIncrement = require('mongoose-auto-increment');
const dbConnection = require('../configs/dbConnect').createLocalConnection;

autoIncrement.initialize(dbConnection);

const mondaiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    mondaiOrder: {
      type: Number,
      default: 1
    },
    description: {
      type: String,
      required: true
    },
    part: {
      type: partSchema,
      required: true
    },
    skill: {
      type: skillSchema,
      required: true
    }
  },
  {
    collection: 'mondai'
  }
);

mondaiSchema.plugin(autoIncrement.plugin, {
  model: 'Mondai',
  field: 'mondaiOrder',
  startAt: 1
});

const Mondai = mongoose.model('Mondai', mondaiSchema);

function validateMondai(mondai) {
  const schema = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    partID: Joi.objectId().required(),
    skillID: Joi.objectId().required()
  };
  return Joi.validate(mondai, schema);
}

exports.mondaiSchema = mondaiSchema;
exports.Mondai = Mondai;
exports.validate = validateMondai;
