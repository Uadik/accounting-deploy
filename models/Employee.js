const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 100,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'profiles',
    required: true,
  },
});

module.exports = Employee = mongoose.model('employees', EmployeeSchema);
