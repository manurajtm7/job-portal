const express = require("express");
const router = express.Router();
const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const JobSchema = require("../../schema/Job-schema/JobSchema");
const { default: mongoose } = require("mongoose");

router.get("/jobs/posts", verifyUser, async (req, res) => {
  const userId = res.user._id;

  try {
    const response = await JobSchema.find({ employerDetails: userId });
    res
      .json({
        headers: "Posted jobs list",
        body: response,
      })
      .status(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.delete("/jobs/posts", verifyUser, async (req, res) => {
  const { _id } = req.body;

  try {
    const response = await JobSchema.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(_id),
    });

    if (response)
      res
        .json({
          headers: "Job post deleted",
          body: "Successfully deleted job post",
        })
        .status(200);
    else throw new Error("Something wrong with deletion");
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
