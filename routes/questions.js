const express = require('express');
const router = express.Router();
const { Sentence } = require('../models/sentence');
const { Question, validate } = require('../models/question');

router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const sentence = await Sentence.findById(req.body.sentenceID);
  if (!sentence) return res.status(400).send('Invalid sentence !!!');

  try {
    const question = new Question({
      sentence: sentence.sentenceOrder,
      questionDetail: req.body.questionDetail,
      questionURL: req.body.questionURL,
      mark: req.body.mark
    });
    await question.save();

    res.status(200).json(question);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
