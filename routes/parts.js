const express = require('express');
const router = express.Router();
const { Part, validate } = require('../models/part');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
  try {
    const parts = await Part.find();
    res.status(200).json(parts);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const part = new Part({
      name: req.body.name
    });
    await part.save();
    res.status(200).json(part);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
