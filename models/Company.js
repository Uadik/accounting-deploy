const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  name: {
    type: String,
    required: true,
    min: 3,
    max: 150,
  },
  description: {
    type: String,
    max: 1000,
  },
  isPublic: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Docfile = mongoose.model('companies', CompanySchema);
