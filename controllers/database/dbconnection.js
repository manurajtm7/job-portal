const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(process.env.DATA_BASE_CNCT_STRING)
    .then(() => {
      console.log("database connection success");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = connect;
