const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Position = require('../../models/Position');
const Company = require('../../models/Company');

// @route     GET api/positions/?parent=123,company=123
// @desc      fetch employees of company by company id
// @access    private
router.get('/', auth, async (req, res) => {
  const { company, parent } = req.query;

  try {
    const companyDoc = await Company.findById(company);
    if (!companyDoc)
      return res.status(404).json({ msg: 'No positions found!' });

    if (req.user.id !== companyDoc.user._id.toString() && !companyDoc.public) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    let filter = {
      company: companyDoc._id,
    };
    if (parent === 'null') filter.parent = null;

    if (parent && parent !== 'null') {
      const parentDoc = await Position.findById(parent);
      if (!parentDoc)
        return res.status(401).json({ msg: 'No positions found!' });

      filter.parent = parent;
    }

    const positions = await Position.find(filter).sort({ date: -1 });

    if (!positions.length)
      return res.status(404).json({ msg: 'No positions found!' });

    res.json(positions);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     Post api/positions/?parent=123,company=123
// @desc      create position
// @accress   private
router.post(
  '/',
  auth,
  [
    check('title', 'Title min length is 3 and max lenght is 100').isLength({
      min: 3,
      max: 100,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company, parent } = req.query;

    try {
      const companyDoc = await Company.findById(company);
      if (!companyDoc)
        return res.status(404).json({ msg: 'Company not found' });

      if (req.user.id !== companyDoc.user._id.toString())
        return res.status(401).json({ msg: 'User not authorized' });

      let positionFields = {
        title: req.body.title,
        company: companyDoc._id,
      };

      if (parent) {
        const parentDoc = await Position.findById(parent);
        if (!parentDoc)
          return res.status(401).json({ msg: 'Parent not found' });

        positionFields.parent = parentDoc._id;
      }

      const newPos = new Position(positionFields);

      const savedPos = await newPos.save();

      res.json(savedPos);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ err: 'Server error' });
    }
  }
);

// @route     DELETE api/positions/:id
// @desc      delete position
// @accress   private
router.delete('/:id', auth, async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    const company = await Company.findById(position.company);

    if (req.user.id !== company.user._id.toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const findIds = async (ids) => {
      if (!ids.length) return [];

      for (i = 0; i < ids.length; i++) {
        const children = await Position.find({ parent: ids[i] }).distinct(
          '_id'
        );
        if (!children.length) continue;

        const childrensChildren = await findIds(children);
        ids = [...ids, ...childrensChildren];
      }
      return ids;
    };

    const ids = await findIds([position._id]);

    console.log('delete many', ids);

    await Position.deleteMany({
      _id: {
        $in: ids,
      },
    });

    return res.json({ success: true });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No position found!' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
