const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
 firstname: {
    type: String,
    required: true,
  },
 lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;