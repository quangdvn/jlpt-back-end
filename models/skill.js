const Joi = require('joi');
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    skillOrder: {
      type: Number
    }
  },
  {
    collection: 'skills'
  }
);

const Skill = mongoose.model('Skill', skillSchema);

function validateSkill(skill) {
  const schema = {
    name: Joi.string().required()
  };
  return Joi.validate(skill, schema);
}

exports.skillSchema = skillSchema;
exports.Skill = Skill;
exports.validate = validateSkill;
