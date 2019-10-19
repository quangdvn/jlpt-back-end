const express = require('express');
const router = express.Router();
const { Sentence } = require('../models/sentence');
const { Exam } = require('../models/exam');
const { Question } = require('../models/question');
const { Answer } = require('../models/answer');
const { Mondai } = require('../models/mondai');
const { Part } = require('../models/part');
const { Skill } = require('../models/skill');
const countMondai = require('../utils/countMondai');

//* to store current exam questions data
let curQuestionList = [];

//* Get all exam data
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//* Get exam sentences by skill
router.get('/:id/:skillID', async (req, res) => {
  try {
    const { id, skillID } = req.params;
    //* Get current Exam
    
    const exam = await Exam.findOne({ examNumber: id }).select('-_id');

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

    //* Temporary store questions list into a carbon copy
    curQuestionList = [...curQuestionList, ...questionList];

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

//* Get sentences answers
router.get('/answers', async (req, res) => {
  try {
    //* Get all Answers included
    const answers = await Answer.find({ question: curQuestionList })
      .select('-_id -__v -avatar')
      .sort('answerOrder');

    res.status(200).json({
      answers: answers
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//* Refresh question local storage
router.delete('/answers', (req, res) => {
  curQuestionList = [];
  res.status(200).send('Bye curTest !!!');
  console.log(curQuestionList);
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
