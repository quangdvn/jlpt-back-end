const Joi = require('joi');
// Joi.objectID = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    examNumber: {
      type: Number
    }
  },
  { collection: 'exams' }
);

const Exam = mongoose.model('Exam', examSchema);

function validateExam(exam) {
  const schema = {
    examNumber: Joi.number().required()
  };
  return Joi.validate(exam, schema);
}

exports.Exam = Exam;
exports.examSchema = examSchema;
exports.validate = validateExam;
