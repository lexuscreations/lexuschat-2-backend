const mongoose = require("mongoose");

const Chat = mongoose.model(
  "Chat",
  new mongoose.Schema(
    {
      username: { type: String, required: true },
      chat: { type: String, required: true },
    },
    { timestamps: true }
  )
);

module.exports = Chat;
