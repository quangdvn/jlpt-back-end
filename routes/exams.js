const express = require('express');
const router = express.Router();
const { Sentence } = require('../models/sentence');
const { Exam, validate } = require('../models/exam');
const { Question } = require('../models/question');
const { Answer } = require('../models/answer');
const { Mondai } = require('../models/mondai');
const { Skill } = require('../models/skill');
const countMondai = require('../utils/countMondai');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//* Get all exam data
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//* Insert exam data
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let exam = await Exam.findOne({ examNumber: req.body.examNumber });
  if (exam) return res.status(400).send('Exam already existed !!!');

  try {
    const {
      examNumber,
      examTitle,
      examLevel,
      totalMark,
      examDurationPart1,
      examDurationPart2
    } = req.body;
    exam = new Exam({
      examNumber,
      examTitle,
      examLevel,
      totalMark,
      examDurationPart1,
      examDurationPart2
    });
    await exam.save();

    res.status(200).json(exam);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//* Get 1 exam data
router.get('/:id/info', async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findOne({ examNumber: id }).select('-_id -__v');

    if (!exam) return res.status(400).send('Invalid exam !!!');

    res.status(200).send(exam);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//* Get exam sentences by skill
router.get('/:id/:skillID', auth, async (req, res) => {
  try {
    const { id, skillID } = req.params;
    //* Get current Exam

    const exam = await Exam.findOne({ examNumber: id }).select('-_id -__v');

    //* Get given skills and parts included
    const curSkill = await Skill.findOne({ skillOrder: skillID }).select(
      '-__v'
    );
    if (!curSkill) return res.status(400).send('Invalid skill ...');

    //* Get given mondai
    const mondaiList = countMondai(id);
    const mondai = await Mondai.find({
      'skill._id': curSkill._id,
      mondaiOrder: mondaiList
    }).select('-__v -_id -skill -part');

    const sentences = await Sentence.find({ exam: id, skill: skillID }).select(
      '-__v -_id '
    );

    const sentenceList = sentences.map(item => item.sentenceOrder);

    //* Get all Questions included
    const questions = await Question.find({ sentence: sentenceList })
      .select('-_id -__v')
      .sort('questionOrder');
    const questionList = questions.map(item => item.questionOrder);

    //* Get all Answers included
    const answers = await Answer.find({ question: questionList })
      .select('-_id -__v -isTrue -avatar')
      .sort('answerOrder');

    res.status(200).json({
      exam: exam,
      skill: curSkill,
      mondai: mondai,
      sentences: sentences,
      questions: questions,
      answers: answers
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;

// //* Get all exam sentences
// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     //* Get current Exam
//     const exam = await Exam.findOne({ examNumber: id }).select('-_id');

//     //* Get given skills and parts included
//     const skills = await Skill.find({})
//       .select('-_id -__v')
//       .sort('skillOrder');
//     const parts = await Part.find({})
//       .select('-_id -__v')
//       .sort('partOrder');
//     //* Get given mondai included
//     const mondaiList = countMondai(id);
//     const mondai = await Mondai.find({ mondaiOrder: mondaiList })
//       .select('-_id -__v -skill -part')
//       .sort('mondaiOrder');

//     //* Get all Sentences included
//     const sentences = await Sentence.find({ exam: id })
//       .select('-exam -_id -__v')
//       .sort('sentenceOrder');
//     const sentenceList = sentences.map(item => item.sentenceOrder);

//     //* Get all Questions included
//     const questions = await Question.find({ sentence: sentenceList })
//       .select('-_id -__v')
//       .sort('questionOrder');
//     const questionList = questions.map(item => item.questionOrder);

//     //* Get all Answers included
//     const answers = await Answer.find({ question: questionList })
//       .select('-_id -__v -isTrue -avatar')
//       .sort('answerOrder');

//     res.status(200).json({
//       exam: exam,
//       skills: skills,
//       parts: parts,
//       mondai: mondai,
//       sentences: sentences,
//       questions: questions,
//       answers: answers
//     });
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });
