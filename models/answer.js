const Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const dbConnection = require('../configs/dbConnect').createLocalConnection;

autoIncrement.initialize(dbConnection);

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: Number,
      required: true
    },
    answerOrder: {
      type: Number,
      default: 1
    },
    answerDetail: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },
    isTrue: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'answers'
  }
);

answerSchema.plugin(autoIncrement.plugin, {
  model: 'Answer',
  field: 'answerOrder',
  startAt: 1
});

const Answer = mongoose.model('Answer', answerSchema);

function validateAnswer(answer) {
  const schema = {
    questionID: Joi.objectID().required(),
    answerDetail: Joi.string().required(),
    avatar: Joi.string()
      .required()
      .allow(null, ''),
    isTrue: Joi.boolean()
  };
  return Joi.validate(answer, schema);
}

exports.answerSchema = answerSchema;
exports.Answer = Answer;
exports.validate = validateAnswer;
