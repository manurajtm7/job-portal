const express = require("express");
const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const Profile = require("../../schema/personal-info-schema/PersonalInfoSchema");
const UserModel = require("../../schema/user-registration-schema/UserRegistration");
const route = express.Router();

route.post("/", verifyUser, async (req, res) => {
  const { age, dob, hobbies, interests, habits, qualification } = req.body;

  const userId = res.user._id; // value from the middleware

  try {
    const personalInfoDetails = await Profile.create({
      age,
      dob,
      hobbies,
      interests,
      habits,
      qualification,
    });

    const personalDetailsId = personalInfoDetails._id;
    const updatedUserDetail = await UserModel.findByIdAndUpdate(
      {
        _id: userId,
      },
      { personalDetails: personalDetailsId }
    );

    if (updatedUserDetail) {
      res
        .json({
          headers: "User personal info created",
          body: "successfully updated user personal information",
        })
        .status(200);
    } else {
      throw new Error("Something wrong with server / authentication failed");
    }
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = route;
