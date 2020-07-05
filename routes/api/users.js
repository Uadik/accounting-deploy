const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
const key = require('../../config/keys_deploy').secretOrKey;

// @route     GET api/users/test
// @desc      test route
// @accress   public
router.get('/test', (req, res) => {
  return res.json({
    msg: 'Users works',
  });
});

// @route     POST api/users/register
// @desc      register user and return token
// @accress   public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already exists' }] });
      }

      // const avatar = gravatar.url(email, {
      //   s: '200',
      //   r: 'pg',
      //   d: 'mm'
      // });

      let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        // avatar: req.body.avatar,
        password: req.body.password,
      });

      const salt = await bcrypt.genSalt(10);

      newUser.password = await bcrypt.hash(password, salt);

      const savedUser = await newUser.save();
      console.log(`Added user ${savedUser.email}`);

      const payload = {
        user: {
          id: savedUser.id,
        },
      };

      jwt.sign(payload, key, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route     POST api/users/login
// @desc      login user and return token
// @accress   public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, key, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

// GET api/users/auth
// protected
// return current user
router.get('/auth', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(res.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
