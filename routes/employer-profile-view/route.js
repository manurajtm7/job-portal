const express = require("express");
const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const UserModel = require("../../schema/user-registration-schema/UserRegistration");

const router = express.Router();

router.post("/", verifyUser, async (req, res) => {
  const { _id } = req.body;

  try {
    const response = await UserModel.findById({ _id })
      .populate("personalDetails")
      .select({ hashedPssword: 0 });

    if (response) {
      res.json({ header: "Usser profile details", body: response }).status(200);
    } else {
      throw new Error("Uesr data unavailabe / authentication failure");
    }
  } catch (err) {
    res.sendStatus(400);
  }
});

module.exports = router;
