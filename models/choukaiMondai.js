const mongoose = require('mongoose');

const choukaiMondaiSchema = new mongoose.Schema(
  {
    choukaiLevel: {
      type: String,
      required: true
    },
    choukaiList: {
      type: Array,
      required: true
    }
  },
  { collection: 'choukaiMondai' }
);

const ChoukaiMondai = mongoose.model('ChoukaiMondai', choukaiMondaiSchema);

exports.ChoukaiMondai = ChoukaiMondai;
