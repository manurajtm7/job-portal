const bcrypt = require("bcrypt");

const SALT_RANGE = 10;

const hashPssword = (password) => {
  return bcrypt.hash(password, SALT_RANGE);
};

const comparePassword = (password, hashedPssword) => {
  return bcrypt.compare(password, hashedPssword, (err, result) => {
    if (err) return false;
    if (result) return true;
  });
};

module.exports = { hashPssword, comparePassword };
