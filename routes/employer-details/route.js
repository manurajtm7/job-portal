const express = require("express");
const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const EmplyerModel = require("../../schema/employer-schema/EmployerSchema");
const UserModel = require("../../schema/user-registration-schema/UserRegistration");
const router = express.Router();

router.post("/", verifyUser, async (req, res) => {
  const { companyName, designation, location } = req.body;
  const userId = res.user._id;


  try {
    const EmployerDetails = await EmplyerModel.create({
      companyName,
      designation,
      location,
    });

    const updatedUserDetail = await UserModel.findByIdAndUpdate(
      {
        _id: userId,
      },
      { EmployerDetails: EmployerDetails._id }
    );
    res
      .cookie("EMPLOYER_TOKEN", atob(userId))
      .json({
        header: "Employer details added",
        body: userId,
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

module.exports = router;
