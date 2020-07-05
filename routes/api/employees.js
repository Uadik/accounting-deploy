const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Employee = require('../../models/Employee');
const Company = require('../../models/Company');

// @route     GET api/employees/?company=123
// @desc      fetch employees of company by company id
// @access    private
router.get('/', auth, async (req, res) => {
  const { company } = req.query;

  try {
    const companyDoc = await Company.findById(company);
    if (!companyDoc)
      return res.status(404).json({ msg: 'No employees found!' });

    if (req.user.id !== companyDoc.user._id.toString() && !companyDoc.public) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const employees = await Employee.find({ company }).sort({
      date: -1,
    });

    if (!employees) return res.status(404).json({ msg: 'No employees found!' });

    res.json(employees);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     GET api/employees/:id
// @desc      fetch employee by id
// @accress   private
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ company: req.params.id });
    if (!employee) return res.status(404).json({ msg: 'No employee found!' });

    const company = await Company.findById(employee.company);
    if (!company) return res.status(404).json({ msg: 'No employee found!' });

    if (req.user.id !== company.user._id.toString() && !company.public) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(employee);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/employees/?company=123
// @desc      create employee
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

      const newEmployee = new Employee({
        name: req.body.name,
        company: companyDoc._id,
      });

      const employee = await newEmployee.save();

      return res.json(employee);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     DELETE api/employees/:id
// @desc      delete employee
// @accress   private
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    const company = await Company.findById(employee.company);

    if (req.user.id !== company.user._id.toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await employee.remove();

    return res.json({ success: true });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No employee found!' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
