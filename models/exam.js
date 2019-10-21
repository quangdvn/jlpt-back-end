const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    examNumber: {
      type: Number,
      required: true
    },
    examTitle: {
      type: String,
      required: true
    },
    viewCount: {
      type: Number,
      default: 0
    },
    examLevel: {
      type: Number,
      required: true
    },
    totalMark: {
      type: Number,
      required: true
    },
    passMark: {
      type: Number
    },
    examDurationPart1: {
      type: Number,
      required: true
    },
    examDurationPart2: {
      type: Number,
      required: true
    },
    tryId: {
      type: Array
    }
  },
  { timestamps: true, collection: 'exams' }
);

examSchema.pre('save', async function(next) {
  let exam = this;
  try {
    exam.passMark = exam.totalMark / 2;
    next();
  } catch (err) {
    next(err);
  }
});

const Exam = mongoose.model('Exam', examSchema);

function validateExam(exam) {
  const schema = Joi.object({
    examNumber: Joi.number().required(),
    examTitle: Joi.string().required(),
    examLevel: Joi.number().required(),
    totalMark: Joi.number().required(),
    examDurationPart1: Joi.number().required(),
    examDurationPart2: Joi.number().required()
  });
  return schema.validate(exam);
}

exports.Exam = Exam;
exports.examSchema = examSchema;
exports.validate = validateExam;
