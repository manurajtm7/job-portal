const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, require: true, min: 5 },
  jobDescription: { type: String, require: true, min: 5 },
  salary: { type: Number, require: true },
  expectedDate: { type: String, require: true },
  location: { type: String, require: true },
  createdAt: { type: Date, default: Date.now() },
  employerDetails: { type: mongoose.Schema.ObjectId, ref: "user-data" },
});

const model = mongoose.model("jobs-schema", jobSchema);

module.exports = model;
