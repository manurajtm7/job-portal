const express = require("express");
const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const UserModel = require("../../schema/user-registration-schema/UserRegistration");
const router = express.Router();

router.get("/", verifyUser, async (req, res) => {
  const _id = res.user._id;

  try {
    const response = await UserModel.findById({ _id })
      .populate("personalDetails")
      .populate("EmployerDetails")
      .select({ hashedPssword: 0 });

    if (response) {
      res.json({ header: "User profile details", body: response }).status(200);
    } else {
      throw new Error("Uesr data unavailabe / authentication failure");
    }
  } catch (err) {
    res.sendStatus(400);
  }
});

router.post("/", verifyUser, async (req, res) => {
  const userId = res.user._id;
  const { skills } = req.body;

  try {
    const userUpdate = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { $push: { Skills: skills } }
    );

    if (userUpdate) {
      res
        .json({
          header: "User profile details updated",
          body: "successfully added user skills",
        })
        .status(200);
    } else {
      throw new Error("Uesr data unavailabe / authentication failure");
    }
  } catch (err) {
    res.sendStatus(400);
  }
});

module.exports = router;
