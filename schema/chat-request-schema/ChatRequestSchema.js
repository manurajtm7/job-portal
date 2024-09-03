const mongoose = require("mongoose");

const ChatRequestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.ObjectId,
    ref: "user-data",
    required: true,
    unique: true,
  },
  Requeststatus: { type: Boolean, default: false },
  time: { type: Date, default: Date.now() },
});

const ChatRequestModel = mongoose.model("chat-request", ChatRequestSchema);

module.exports = ChatRequestModel;
