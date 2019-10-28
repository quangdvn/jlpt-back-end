const express = require('express');
const router = express.Router();
const { Question } = require('../models/question');
const { Answer, validate } = require('../models/answer');
const { Sentence } = require('../models/sentence');
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

//* Get all answers by ExamNumber
router.get('/all/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    //* Get all Sentences included
    const sentences = await Sentence.find({ exam: id });

    const sentenceList = sentences.map(item => item.sentenceOrder);

    // //* Get all Questions included
    const questions = await Question.find({ sentence: sentenceList });

    const questionList = questions.map(item => item.questionOrder);

    // //* Get all Answers included
    const answers = await Answer.find({ question: questionList })
      .select('-_id -__v -avatar')
      .sort('answerOrder');

    res.status(200).json({
      answers: answers
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
