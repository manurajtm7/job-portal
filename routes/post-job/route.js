const express = require("express");
const router = express.Router();
const jobSchema = require("../../schema/Job-schema/JobSchema");
const verifyUser = require("../../middlewares/token-verification/tokenVerification");

router.post("/", verifyUser, async (req, res) => {
  const { jobTitle, jobDescription, salary, expectedDate, location } = req.body;
  const userId = res.user._id;

  console.log(userId);
  try {
    const response = await jobSchema.create({
      jobTitle,
      jobDescription,
      salary,
      expectedDate,
      location,
      employerDetails: userId,
    });

    if (response)
      res
        .json({
          header: "Job posted successfully",
          body: "job successfully add to display",
        })
        .status(200);
    else throw new Error("Error on database or network error");
  } catch (err) {
    console.log(err);
    res
      .json({
        header: "Post job error",
        body: "Error ouccured on server please try again later or check network",
      })
      .status(400);
  }
});

module.exports = router;
