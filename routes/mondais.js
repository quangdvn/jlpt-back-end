const express = require('express');
const router = express.Router();
const { Skill } = require('../models/skill');
const { Part } = require('../models/part');
const { Mondai, validate } = require('../models/mondai');

router.get('/', async (req, res) => {
  try {
    const mondais = await Mondai.find();
    res.status(200).json(mondais);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const skill = await Skill.findById(req.body.skillID);
  if (!skill) return res.status(400).send('Invalid skill !!!');

  const part = await Part.findById(req.body.partID);
  if (!part) return res.status(400).send('Invalid part !!!');

  try {
    const mondai = new Mondai({
      name: req.body.name,
      description: req.body.description,
      skill: {
        _id: skill._id,
        name: skill.name
      },
      part: {
        _id: part._id,
        name: part.name
      }
    });
    await mondai.save();

    res.status(200).json(mondai);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
