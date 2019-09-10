const express = require('express');
const router = express.Router();
const { Skill, validate } = require('../models/skill');

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const skill = new Skill({
      name: req.body.name
    });
    await skill.save();
    res.status(200).json(skill);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
