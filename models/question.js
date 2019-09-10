const Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const dbConnection = require('../configs/dbConnect').createLocalConnection;

autoIncrement.initialize(dbConnection);

const questionSchema = new mongoose.Schema(
  {
    sentence: {
      type: Number,
      required: true
    },
    questionOrder: {
      type: Number,
      default: 1
    },
    questionDetail: {
      type: String
    },
    questionURL: {
      type: String
    },
    mark: {
      type: Number,
      required: true
    }
  },
  {
    collection: 'questions'
  }
);

questionSchema.plugin(autoIncrement.plugin, {
  model: 'Question',
  field: 'questionOrder',
  startAt: 1
});

const Question = mongoose.model('Question', questionSchema);

function validateQuestion(question) {
  const schema = {
    sentenceID: Joi.objectID().required(),
    questionDetail: Joi.string()
      .required()
      .allow(null, ''),
    questionURL: Joi.string()
      .required()
      .allow(null, ''),
    mark: Joi.number().required()
  };
  return Joi.validate(question, schema);
}

exports.questionSchema = questionSchema;
exports.Question = Question;
exports.validate = validateQuestion;
