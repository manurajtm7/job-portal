const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.ObjectId, ref: "user-data", required: true },
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: "user-data",
    required: true,
  },
  message: { type: String },
  time: { type: Date, default: Date.now() },
});

const messageModel = mongoose.model("messages", messageSchema);

module.exports = messageModel;
