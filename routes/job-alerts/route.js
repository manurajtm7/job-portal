const express = require("express");
const router = express.Router();

const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const jobApplicationSchema = require("../../schema/job-applications-schema/JobApplicationSchema");
const jobSchema = require("../../schema/Job-schema/JobSchema");

router.get("/", verifyUser, async (req, res) => {
  const userId = res.user._id;

  try {
    const UserDetail = await jobSchema
      .findOne({ employerDetails: userId })
      .populate("employerDetails");

    if (!UserDetail.employerDetails)
      throw new Error("User has no employer details");

    //! change on  aggregations

    const response = await jobApplicationSchema
      .aggregate([
        { $match: { employerDetails: UserDetail.employerDetails._id } },

        {
          $lookup: {
            from: "user-datas",
            localField: "employerDetails",
            foreignField: "_id",
            as: "employer_merge",
          },
        },
        {
          $lookup: {
            from: "user-datas",
            localField: "jobSeekerDetails",
            foreignField: "_id",
            as: "jobseeker_merge",
          },
        },
        {
          $lookup: {
            from: "jobs-schemas",
            localField: "jobDetail",
            foreignField: "_id",
            as: "jobDetail_merge",
          },
        },
        {
          $unwind: "$employer_merge",
        },
        {
          $unwind: "$jobseeker_merge",
        },
        {
          $unwind: "$jobDetail_merge",
        },

        // fetch employer details
        { $project: { "employer_merge.hashedPssword": 0 } },
        { $project: { "jobseeker_merge.hashedPssword": 0 } },
        {
          $lookup: {
            from: "empolyer-schemas",
            localField: "employer_merge.EmployerDetails",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        {
          $unwind: "$companyDetails",
        },
      ])
      .sort({ appliedTime: -1 });

      // console.log("response ====>" , response);

    if (response)
      res
        .json({
          header: "Job alerts",
          body: response,
        })
        .status(200);
    else throw new Error("Error on database or network error");
  } catch (err) {
    res.sendStatus(400);
  }
});

module.exports = router;
