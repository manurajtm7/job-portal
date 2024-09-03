const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  age: { type: Number },
  dob: { type: String, required: true },
  hobbies: String,
  interests: String,
  habits: String,
  qualification: String,
  profilePicture: String,
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
