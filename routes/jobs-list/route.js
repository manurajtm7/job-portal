const express = require("express");
const router = express.Router();

const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const jobSchema = require("../../schema/Job-schema/JobSchema"); //? schema import

router.get("/", verifyUser, async (req, res) => {
  try {
    const response = await jobSchema
      // .find({})
      // .populate("employerDetails")
      // .select({ "employerDetails.hashedPssword": 0 });
      .aggregate([
        { $match: {} },
        {
          $lookup: {
            from: "user-datas",
            localField: "employerDetails",
            foreignField: "_id",
            as: "employerDetails_merge",
          },
        },
        {
          $unwind: "$employerDetails_merge",
        },
        {
          $project: {
            "employerDetails_merge.hashedPssword": 0,
            hashedPssword: 0,
          },
        },
      ])
      .sort({ createdAt: -1 });
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
