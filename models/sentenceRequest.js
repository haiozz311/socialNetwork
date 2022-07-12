const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sentenceRequestSchema = new Schema({
  sentence: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },

  mean: {
    type: String,
    required: true,
    trim: true,
    maxLength: 300,
  },

  note: {
    type: String,
    trim: true,
    maxLength: 100,
  },

  topics: [String],

  isChecked: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: { type: mongoose.Types.ObjectId, ref: 'Users' }

});

const SentenceRequestModel = mongoose.model('sentencesRequest', sentenceRequestSchema, 'sentencesRequest');

module.exports = SentenceRequestModel;
