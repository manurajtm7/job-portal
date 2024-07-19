const express = require("express");
const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const UserModel = require("../../schema/user-registration-schema/UserRegistration");

const router = express.Router();

router.get("/", verifyUser, async (req, res) => {
  const userId = res.user._id;

  try {
    const UserAllDetails = await UserModel.findById({ _id: userId })
      .populate("personalDetails")
      .populate("EmployerDetails")
      .select({ hashedPssword: 0 });

    if (UserAllDetails) {
      res.json({ header: "User profile details", body: UserAllDetails });
    } else {
      throw new Error("User not found / authentication failed");
    }
  } catch (Err) {
    console.log(Err);
    res.sendStatus(400);
  }
});

module.exports = router;
