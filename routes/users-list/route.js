const express = require("express");
const router = express.Router();
const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const UserModel = require("../../schema/user-registration-schema/UserRegistration");

router.get("/", verifyUser, async (_, res) => {
  try {
    const users = await UserModel.find({}).populate("personalDetails").select({
      hashedPssword: 0,
    });
   
    res.json({ header: "User lists", body: users });
  } catch (err) {
    res.sendStatus(400);
  }
});

module.exports = router;
