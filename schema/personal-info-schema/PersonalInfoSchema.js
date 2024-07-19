const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  age: { type: Number },
  dob: { type: String, required: true },
  hobbies: String,
  interests: String,
  habits: String,
  qualification: String,
  //   profilePicture: {
  //     type: String,
  //     required: false,
  //   },
  //   images: [
  //     {
  //       type: String,
  //       required: false,
  //     },
  //   ],
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
