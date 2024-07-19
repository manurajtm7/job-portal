const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPssword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },
  personalDetails: {
    type: mongoose.Schema.ObjectId,
    default: null,
    ref: "Profile",
  },
  EmployerDetails: {
    type: mongoose.Schema.ObjectId,
    default: null,
    ref: "Empolyer-Schema",
  },
  Skills: [
    {
      type: String,
      default: null,
      unique: true,
    },
  ],
});

const UserModel = mongoose.model("user-data", UserSchema);

module.exports = UserModel;
