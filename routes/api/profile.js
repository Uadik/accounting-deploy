const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @route     GET api/profile/me
// @desc      Get current user's profile
// @accress   private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    await profile.populate('user', ['name', 'avatar']);

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).sendStatus('Server Error');
  }
});

// GET api/profile
// private
// returns user profile
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(404).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    return res.status(500).sendStatus('Server Error');
  }
});

// GET api/profile/all
// public
// get all profiles
router.get('/all', async (req, res) => {
  try {
    const profiles = await Profile.find()
      .sort([['date', -1]])
      .limit(10)
      .populate('user', ['name']);

    if (!profiles) {
      return res.status(404).json({ msg: 'No profiles found!' });
    }

    res.json(profiles);
  } catch (err) {
    return res.status(500).json({ error: 'Server Error' });
  }
});

// GET api/profile/handle/:handle
// backend route
// public
// get profile by handle
router.get('/handle/:handle', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      handle: req.params.handle,
    }).populate('user', ['name']);

    if (!profile) {
      return res.status(404).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Server Error' });
  }
});

// GET api/profile/user/:user_id
// backend route
// public
// get profile by user ID
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(404).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Server Error' });
  }
});

// POST api/profile
// private
// create or edit user profile
router.post(
  '/',
  [auth, [check('handle', 'Handle is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // get fields
    const { handle, description } = req.body;
    const profileFields = {};

    profileFields.user = req.user.id;
    if (handle) profileFields.handle = req.body.handle;
    if (description) profileFields.description = req.body.description;

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        const updatedProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(updatedProfile);
      } else {
        //create
        //check if handle exists
        const handledProfile = await Profile.findOne({
          handle: profileFields.handle,
        });
        if (handledProfile) {
          errors.handle = 'That handle already exists';
          return res.status(400).json(errors);
        }

        //save profile
        const savedProfile = await new Profile(profileFields).save();
        return res.json(savedProfile);
      }
    } catch (err) {
      console.log(err);
    }
  }
);

// DELETE api/profile
// private
// delete user and profile
router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findByIdAndRemove(req.user.id);
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: true });
  }
});

module.exports = router;
