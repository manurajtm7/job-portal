const express = require("express");
const passport = require("passport");
const { jwtSign } = require("../../../middlewares/jwtAuth/jwtAuth");
const router = express.Router();

// Route for starting Google authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const { _id, email, hashedPssword } = req.user;

    const token = jwtSign({ _id, email, hashedPssword });

    res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
    res.redirect("http://localhost:5173/job-portal");
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
