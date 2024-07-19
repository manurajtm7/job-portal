const express = require("express");
const router = express.Router();

const {
  hashPssword,
} = require("../../../middlewares/hash-script/hashingPassword");
const { jwtSign } = require("../../../middlewares/jwtAuth/jwtAuth");

const UserModel = require("../../../schema/user-registration-schema/UserRegistration");

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPssword = await hashPssword(password);
    const response = await UserModel.create({ name, email, hashedPssword });
    if (response) {
      const { _id, email, hashedPssword } = response;
      const token = jwtSign({ _id, email, hashedPssword });

      res
        .cookie("token", token, { expires: new Date(Date.now() + 3600000) })
        .json({
          header: "User create",
          body: "user created successfully / reg: completed",
        })
        .status(200);
    } else {
      throw new Error("Internal or network error / database error");
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
    // .json({
    //   header: "Internal server error",
    //   body: "cannot create user - network error / internal error ",
    // })
  }
});

module.exports = router;
