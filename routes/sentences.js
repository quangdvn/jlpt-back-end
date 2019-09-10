const express = require('express');
const router = express.Router();
const { Skill } = require('../models/skill');
const { Part } = require('../models/part');
const { Mondai } = require('../models/mondai');
const { Exam } = require('../models/exam');
const { Sentence, validate } = require('../models/sentence');

router.get('/', async (req, res) => {
  try {
    const sentences = await Sentence.find();
    res.status(200).json(sentences);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const exam = await Exam.findOne({ examNumber: req.body.examNumber });
  if (!exam) return res.status(400).send('Invalid exam !!!');

  const skill = await Skill.findById(req.body.skillID);
  if (!skill) return res.status(400).send('Invalid skill !!!');

  const part = await Part.findById(req.body.partID);
  if (!part) return res.status(400).send('Invalid part !!!');

  const mondai = await Mondai.findById(req.body.mondaiID);
  if (!mondai) return res.status(400).send('Invalid mondai !!!');

  try {
    const sentence = new Sentence({
      exam: exam.examNumber,
      part: part.partOrder,
      skill: skill.skillOrder,
      mondai: mondai.mondaiOrder,
      sentenceDetail: req.body.sentenceDetail,
      level: req.body.level,
      totalMark: req.body.totalMark,
      totalQuestion: req.body.totalQuestion
    });
    await sentence.save();

    res.status(200).json(sentence);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
