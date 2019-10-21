const express = require('express');
const router = express.Router();
const { Question } = require('../models/question');
const { Answer, validate } = require('../models/answer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', [auth, admin], async (req, res) => {
  try {
    const answers = await Answer.find();
    res.status(200).json(answers);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const question = await Question.findById(req.body.questionID);
  if (!question) return res.status(400).send('Invalid question !!!');

  try {
    const answer = new Answer({
      question: question.questionOrder,
      answerDetail: req.body.answerDetail,
      avatar: req.body.avatar,
      isTrue: req.body.isTrue
    });
    await answer.save();

    res.status(200).json(answer);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
