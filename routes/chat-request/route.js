const express = require("express");
const verifyUser = require("../../middlewares/token-verification/tokenVerification");
const ChatRequestModel = require("../../schema/chat-request-schema/ChatRequestSchema");
const UserModel = require("../../schema/user-registration-schema/UserRegistration");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.post("/", verifyUser, async (req, res) => {
  const userId = res.user._id;
  const { personId } = req.body;

  try {
    const response = await ChatRequestModel.create({ requesterId: userId });

    if (response) {
      await UserModel.findByIdAndUpdate(
        { _id: personId },
        { $push: { ChatRequests: response._id } }
      );
      console.log("send reqq", response);
      res.json({
        header: "successfully added a chat request",
        body: "added chat request successfully",
      });
    } else throw new Error("something wrong with creating request");
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/", verifyUser, async (req, res) => {
  const userId = res.user._id;

  try {
    const response = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "chat-requests",
          localField: "ChatRequests",
          foreignField: "_id",
          as: "chat_req_merge",
        },
      },
      { $unwind: "$chat_req_merge" },
      {
        $lookup: {
          from: "user-datas",
          localField: "chat_req_merge.requesterId",
          foreignField: "_id",
          as: "chat_req_user_merge",
        },
      },
      {
        $project: { hashedPssword: 0, "chat_req_user_merge.hashedPssword": 0 },
      },
      { $unwind: "$chat_req_user_merge" },
    ]);

    res.json({
      header: "Chat requests",
      body: response,
    });
  } catch (err) {
    res.sendStatus(400);
  }
});

router.delete("/", verifyUser, async (req, res) => {
  const { requestId } = req.body;
  const userId = res.user._id;

  try {
    const response = await ChatRequestModel.findOneAndDelete({
      requesterId: requestId,
    });

    if (response) {
      await UserModel.findByIdAndUpdate(
        { _id: userId },
        { $pull: { ChatRequests: response._id } }
      );
      res.json({
        header: "chat request deleted or removed",
        body: "chat request deleted or removed succesfully",
      });
    } else throw new Error("something wrong with creating request");
  } catch (err) {
    res.sendStatus(400);
  }
});

router.put("/", verifyUser, async (req, res) => {
  const { requestId } = req.body;
  console.log("req id...",requestId);
  try {
    const response = await ChatRequestModel.findOneAndUpdate(
      { _id: requestId },
      { Requeststatus: true }
    );

    if (response) {
      console.log("send reqq", response);
      res.json({
        header: " successfully updated chat request",
        body: " successfully updated chat request",
      });
    } else throw new Error("something wrong with updating request request");
  } catch (err) {
    res.sendStatus(400);
  }
});

module.exports = router;

// const response = await UserModel.findOne({ _id: userId })
//   .populate("ChatRequests")
//   .select({ _id: 1, ChatRequests: 1 });
