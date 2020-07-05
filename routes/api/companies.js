const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Company = require('../../models/Company');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');

// GET api/companies/user/:id
// public
// fetch user's companies by user id
router.get('/user/:id', async (req, res) => {
  try {
    const companies = await Company.find({
      user: req.params.id,
      isPublic: true,
    });

    console.log(companies);

    if (!companies)
      res.status(404).json({ errors: [{ msg: 'No companies found!' }] });

    res.json(companies);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/companies
// public
// fetch companies
router.get('/', auth, async (req, res) => {
  try {
    const companies = await Company.find({ user: req.user.id });

    if (!companies)
      res.status(404).json({ errors: [{ msg: 'No companies found!' }] });

    res.json(companies);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/companies/:id
// private
// fetch company by id
router.get('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (req.user.id !== company.user.toString() && !company.public) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (!company) {
      return res.status(404).json({ msg: 'Company not found!' });
    }

    return res.json(company);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Company not found!' });
    }
    return res.status(500).send('Server Error');
  }
});

// POST api/companies
// private
// create company
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name min length is 3 and max lenght is 150').isLength({
        min: 3,
        max: 150,
      }),
      check('description', 'Description max length is 1000').isLength({
        max: 1000,
      }),
      check('isPublic', 'Public field should be boolean').isBoolean(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const newCompany = new Company({
        user: req.user.id,
        name: req.body.name,
        description: req.body.description,
        isPublic: req.body.isPublic,
      });

      const company = await newCompany.save();

      return res.json(company);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// POST api/companies/:id
// private
// edit company
router.post(
  '/:id',
  [
    auth,
    [
      check('name', 'Name min length si 3 and max lenght is 150').isLength({
        min: 3,
        max: 150,
      }),
      check('description', 'Description max length is 1000').isLength({
        max: 1000,
      }),
      check('public', 'Public field should be boolean').isBoolean(),
    ],
  ],
  async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);

      if (req.user.id !== company.user.toString() && !company.public) {
        return res.status(401).json({ msg: 'User not authorized!' });
      }

      const errors = validationResult(req);

      if (!errors.isEmpty)
        return res.status(400).jsom({ errors: errors.array() });

      // get fields
      const { name, description, public } = req.body;

      if (name) company.name = name;
      if (description) company.description = description;
      company.public = public;

      const updatedСompany = await company.save();

      return res.json(updatedСompany);
    } catch (err) {
      console.log(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Company not found!' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// DELETE api/companies/:id
// private
// delete company
router.delete('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await company.remove();
    return res.json({ success: true });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Company not found!' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
