const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPssword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },

  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  

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
  verified: {
    type: mongoose.Schema.ObjectId,
    ref: "requests",
    required: false,
  },
  Skills: { type: [String] },
  isRequestAvail: { type: Boolean, default: false },
  ChatRequests: [
    {
      type: mongoose.Schema.ObjectId,
      default: null,
      ref: "chat-request",
    },
  ],
});

const UserModel = mongoose.model("user-data", UserSchema);

module.exports = UserModel;
