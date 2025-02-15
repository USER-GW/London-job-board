const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
 firstname: {
    type: String,
    required: true,
  },
 lastname: {
    type: String,
    required: true,
  },
  company: {
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

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

module.exports = Recruiter;