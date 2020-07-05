const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PositionSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'companies',
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'positions',
    default: null,
  },
  title: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  allowed_docs: [
    {
      docfile: {
        type: Schema.Types.ObjectId,
        ref: 'docfiles',
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Position = mongoose.model('positions', PositionSchema);
