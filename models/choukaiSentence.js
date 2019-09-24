const mongoose = require('mongoose');

const choukaiSentenceSchema = new mongoose.Schema(
  {
    sentence: {
      type: Number,
      required: true
    },
    Url: {
      type: String,
      required: true
    }
  },
  { collection: 'choukaiSentence' }
);

const ChoukaiSentence = mongoose.model('ChoukaiSentence', choukaiSentenceSchema);

exports.ChoukaiSentence = ChoukaiSentence;
