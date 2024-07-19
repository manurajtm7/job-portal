const express = require("express");
const router = express.Router();


const { jwtSign } = require("../../../middlewares/jwtAuth/jwtAuth");

const UserModel = require("../../../schema/user-registration-schema/UserRegistration");
const { compare } = require("bcrypt");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await UserModel.findOne({ email });
    const comparedPassword = await compare(password, response.hashedPssword);

    if (comparedPassword) {
      const { _id, email, hashedPssword } = response;
      const token = jwtSign({ _id, email, hashedPssword });

      res
        .cookie("token", token, { expires: new Date(Date.now() + 3600000) })
        .json({
          header: "User logged in",
          body: "user logged  successfully / login: completed",
        })
        .status(200);
    } else {
      throw new Error("User authentication failed ");
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

module.exports = router;
