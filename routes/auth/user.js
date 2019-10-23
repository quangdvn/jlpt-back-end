const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {
  User,
  validateBlueprint,
  validateUpdateUser
} = require('../../models/user');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

//* Every Api Endpoint used by Admin Account

//* Get all Users
router.get('/', [auth, admin], async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .sort('fullname')
      .select('-__v -password -isAdmin');

    return res.status(200).send(users);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//* Get single User
router.get('/:id', [auth, admin], async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id, isAdmin: false }).select(
      '-_id -__v -password'
    );
    if (!user) return res.status(400).send('Invalid user !!!');

    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//* Create new Blueprint User
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateBlueprint(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email: req.body.email, isAdmin: false });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['username', 'email', 'password']));
    await user.save();

    return res.status(200).send(_.pick(user, ['_id', 'username']));
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//* Update User
router.put('/:id', [auth, admin], async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { fullname, contactNumber } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isAdmin: false },
      { fullname, contactNumber },
      { new: true }
    );

    if (!user) return res.status(400).send('Invalid user !!!');

    res.status(200).json({
      msg: 'Update successful',
      userData: { fullname, contactNumber }
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//* Delete User
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const user = await User.findOneAndRemove({
      _id: req.params.id,
      isAdmin: false
    });
    if (!user) return res.status(400).send('Invalid user !!!');

    return res.status(200).send('Delete success !!!');
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
