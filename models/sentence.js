const Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const dbConnection = require('../configs/dbConnect').createLocalConnection;

autoIncrement.initialize(dbConnection);

const sentenceSchema = new mongoose.Schema(
  {
    exam: {
      type: Number,
      required: true
    },
    part: {
      type: Number,
      required: true
    },
    skill: {
      type: Number,
      required: true
    },
    mondai: {
      type: Number,
      required: true
    },
    sentenceDetail: {
      type: String
    },
    sentenceOrder: {
      type: Number,
      default: 1
    },
    level: {
      type: Number,
      required: true
    },
    totalMark: {
      type: Number,
      required: true
    },
    totalQuestion: {
      type: Number,
      required: true
    }
  },
  {
    collection: 'sentences'
  }
);

sentenceSchema.plugin(autoIncrement.plugin, {
  model: 'Sentence',
  field: 'sentenceOrder',
  startAt: 1
});

const Sentence = mongoose.model('Sentence', sentenceSchema);

function validateSentence(sentence) {
  const schema = {
    examNumber: Joi.number().required(),
    partID: Joi.objectID().required(),
    skillID: Joi.objectID().required(),
    mondaiID: Joi.objectID().required(),
    sentenceDetail: Joi.string().allow(null, ''),
    level: Joi.number().required(),
    totalMark: Joi.number().required(),
    totalQuestion: Joi.number().required()
  };
  return Joi.validate(sentence, schema);
}

exports.sentenceSchema = sentenceSchema;
exports.Sentence = Sentence;
exports.validate = validateSentence;
