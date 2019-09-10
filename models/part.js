const Joi = require('joi');
const mongoose = require('mongoose');

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    partOrder: {
      type: Number
    }
  },
  {
    collection: 'parts'
  }
);

const Part = mongoose.model('Part', partSchema);

function validatePart(part) {
  const schema = {
    name: Joi.string().required()
  };
  return Joi.validate(part, schema);
}

exports.partSchema = partSchema;
exports.Part = Part;
exports.validate = validatePart;
