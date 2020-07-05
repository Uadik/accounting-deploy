const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocfileSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
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

module.exports = Docfile = mongoose.model('docfiles', DocfileSchema);
