const express = require("express");
const router = express.Router();

const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const jobSchema = require("../../schema/Job-schema/JobSchema"); //? schema import

router.get("/", verifyUser, async (req, res) => {
  try {
    const response = await jobSchema
      .find({})
      .sort({ createdAt: -1 })
      .populate("employerDetails");

    if (response)
      res
        .json({
          header: "Available jobs list",
          body: response,
        })
        .status(200);
    else throw new Error("Error on database or network error");
  } catch (err) {
    res
      .json({
        header: "Unable to get data / fetch error",
        body: "Error ouccured on server please try again later or check network",
      })
      .status(400);
  }
});

module.exports = router;
