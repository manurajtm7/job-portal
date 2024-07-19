const { jwtVerify } = require("../jwtAuth/jwtAuth");

const verifyUser = (req, res, next) => {
  const UserCookie = req.cookies.token;
  const userData = jwtVerify(UserCookie);

  if (userData) {
    res.user = userData;
    next();
  } else {
    res
      .json({
        header: "Access token not valid",
        body: " toke is not valid / retry sign in",
      })
      .status(400);
  }
};

module.exports = verifyUser;
