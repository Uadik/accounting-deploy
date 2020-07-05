const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Docfile = require('../../models/Docfile');
const Company = require('../../models/Company');

// @route     GET api/documents/?company=123
// @desc      fetch docfiles of company by company id
// @access    private
router.get('/', auth, async (req, res) => {
  const { company } = req.query;
  try {
    const companyDoc = await Company.findById(company);
    if (!companyDoc) return res.status(404).json({ msg: 'No docfiles found!' });

    if (req.user.id !== companyDoc.user._id.toString() && !companyDoc.public) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const docfiles = await Docfile.find({ company }).sort({
      date: -1,
    });

    if (!docfiles) return res.status(404).json({ msg: 'No docfiles found!' });

    res.json(docfiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     GET api/documents/:id
// @desc      fetch docfile by id
// @accress   private
router.get('/:id', auth, async (req, res) => {
  try {
    const docfile = await Docfile.findOne({ company: req.params.id });
    if (!docfile) return res.status(404).json({ msg: 'No docfile found!' });

    const company = await Company.findById(docfile.company);
    if (!company) return res.status(404).json({ msg: 'No docfile found!' });

    if (req.user.id !== company.user._id.toString() && !company.public) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(docfile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/documents/?company=123
// @desc      create docfile
// @accress   private
router.post(
  '/',
  auth,
  [
    check('name', 'Name min length is 5 and max lenght is 100').isLength({
      min: 5,
      max: 100,
    }),
  ],
  async (req, res) => {
    const { company } = req.query;

    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const companyDoc = await Company.findById(company);
      if (!companyDoc)
        return res.status(404).json({ msg: 'No company found!' });

      if (req.user.id !== companyDoc.user._id.toString()) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      const newDocfile = new Docfile({
        name: req.body.name,
        company: companyDoc._id,
      });

      const docfile = await newDocfile.save();

      return res.json(docfile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     DELETE api/documents/:id
// @desc      delete docfile
// @accress   private
router.delete('/:id', auth, async (req, res) => {
  try {
    const docfile = await Docfile.findById(req.params.id);
    const company = await Company.findById(docfile.company);

    if (req.user.id !== company.user._id.toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await docfile.remove();

    return res.json({ success: true });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No docfile found!' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
