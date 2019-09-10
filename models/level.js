// const Joi = require('joi');
// const mongoose = require('mongoose');

// const levelSchema = new mongoose.Schema(
//   {
//     level: {
//       type: String,
//       required: true
//     },
//     description: {
//       type: String,
//       required: true
//     }
//   },
//   {
//     collection: 'levels'
//   }
// );

// const Level = mongoose.model('Level', levelSchema);

// function validateLevel(level) {
//   const schema = {
//     level: Joi.string().required(),
//     description: Joi.string().required()
//   };
//   return Joi.validate(level, schema);
// }

// exports.levelSchema = levelSchema;
// exports.Level = Level;
// exports.validate = validateLevel;
