const auth = require('../../middleware/auth');
const { User, validateRegister } = require('../../models/user');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).send(user);
});

router.post('/', async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { password, re_password } = req.body;
  if (password !== re_password)
    return res.status(400).send('Password mis-match.');

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(
    _.pick(req.body, ['username', 'fullname', 'email', 'password'])
  );
  await user.save();

  const token = user.generateAuthToken();

  res
    .header('x-auth-token', token)
    .status(200)
    .send(_.pick(user, ['_id', 'username', 'email']));
});

module.exports = router;
