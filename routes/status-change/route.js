const express = require("express");
const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const JobApplicationModel = require("../../schema/job-applications-schema/JobApplicationSchema");
const router = express.Router();

router.post("/", verifyUser, async (req, res) => {
  const { status, jobId } = req.body;
  try {
    const response = await JobApplicationModel.findByIdAndUpdate(
      { _id: jobId },
      { status }
    );

    if (response) {
      res
        .json({
          header: "Update on status",
          body: "successfully updated status",
        })
        .status(200);
    } else {
      throw new Error("authentication failed / network issue");
    }
  } catch {
    res.sendStatus(400).json({
      header: "Error on Update  status",
      body: "something happened to updations on  status",
    });
  }
  
});

module.exports = router;
