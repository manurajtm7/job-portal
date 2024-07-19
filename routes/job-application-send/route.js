const express = require("express");
const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const UserModel = require("../../schema/user-registration-schema/UserRegistration");
const jobApplicationModel = require("../../schema/job-applications-schema/JobApplicationSchema");

const router = express.Router();

router.post("/", verifyUser, async (req, res) => {
  const userId = res.user._id;
  const { jobId, postedUserId } = req.body;

  try {
    // const userAllDetails = await UserModel.findOne({ _id: userId });

    const jobApplicationUpdate = await jobApplicationModel.create({
      jobSeekerDetails: userId,
      employerDetails: postedUserId,
      jobDetail: jobId,
    });

    res.json(jobApplicationUpdate).status(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

module.exports = router;
