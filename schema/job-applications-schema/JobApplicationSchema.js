const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  employerDetails: { type: mongoose.Schema.ObjectId, ref: "user-data" },
  jobSeekerDetails: { type: mongoose.Schema.ObjectId, ref: "user-data" },
  jobDetail: { type: mongoose.Schema.ObjectId, ref: "jobs-schema" },
  status: { type: String, default: "PENDING" },
  appliedTime: { type: Date, default: Date.now() },
});

const JobApplicationModel = mongoose.model(
  "applications-schema",
  jobApplicationSchema
);

module.exports = JobApplicationModel;
