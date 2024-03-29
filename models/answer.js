const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
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
  const schema = Joi.object({
    questionID: Joi.objectId().required(),
    answerDetail: Joi.string().required(),
    isTrue: Joi.boolean()
  });
  return schema.validate(answer);
}

exports.answerSchema = answerSchema;
exports.Answer = Answer;
exports.validate = validateAnswer;
