const express = require("express");
const route = express.Router();
const cloudinary = require("cloudinary").v2;

const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const Profile = require("../../schema/personal-info-schema/PersonalInfoSchema");
const UserModel = require("../../schema/user-registration-schema/UserRegistration");
const { default: mongoose } = require("mongoose");

route.post("/", verifyUser, async (req, res) => {
  const { age, dob, hobbies, interests, habits, qualification } = req.body;

  const image_path = req.files[0].path;
  const image_upload = await cloudinary.uploader.upload(
    image_path,
    (err, result) => err && console.log("error ->", err)
  );

  const userId = res.user._id; // value from the middleware

  try {
    const personalInfoDetails = await Profile.create({
      age,
      dob,
      hobbies,
      interests,
      habits,
      qualification,
      profilePicture: image_upload.url,
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

// patch request

route.patch("/", verifyUser, async (req, res) => {
  const { age, dob, hobbies, interests, habits, qualification } = req.body;

  const image_path = req?.files[0]?.path;
  const userId = res.user._id;

  try {
    const image_upload = await cloudinary.uploader.upload(
      image_path,
      (err, result) => {
        console.log("error ->", err);
        if (err) return null;
      }
    );

    const userDetails = await UserModel.findById({
      _id: new mongoose.Types.ObjectId(userId),
    });
    const personalInfoDetails = await Profile.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(userDetails.personalDetails) },
      {
        age,
        dob,
        hobbies,
        interests,
        habits,
        qualification,
        profilePicture: image_path && image_upload.url,
      },
      {
        new: true,
      }
    );

    if (personalInfoDetails) {
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
    console.log(e);

    res.sendStatus(400);
  }
});
module.exports = route;
