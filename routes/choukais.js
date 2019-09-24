const express = require('express');
const router = express.Router();
const { ChoukaiMondai } = require('../models/choukaiMondai');
const { ChoukaiSentence } = require('../models/choukaiSentence');

router.get('/sentences/', async (req, res) => {
  try {
    const sentence = await ChoukaiSentence.find({ sentence: { $lte: 15 } });
    res.status(200).json(sentence);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.get('/mondais/', async (req, res) => {
  try {
    const mondais = await ChoukaiMondai.find();
    res.status(200).json(mondais);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.get('/mondais/:levelId', async (req, res) => {
  const { levelId } = req.params;
  try {
    const { choukaiList } = await ChoukaiMondai.findOne({
      choukaiLevel: levelId
    }).select('-__v -_id');
    res.status(200).json(choukaiList);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
