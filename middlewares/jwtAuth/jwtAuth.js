const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;

const jwtSign = ({ _id, email, hashedPssword }) => {
  return jwt.sign({ _id, email, hashedPssword }, jwtKey);
};

const jwtVerify = (token) => {
  return jwt.verify(token, jwtKey);
};

module.exports = { jwtSign, jwtVerify };
