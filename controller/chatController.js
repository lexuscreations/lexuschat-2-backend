const { Chat } = require("../models/");

module.exports = {
  create(req, res) {
    const { username, chat } = req.body;
    const chatObj = new Chat({ username, chat });
    chatObj.save().then((response) => res.send(response));
  },
  find(req, res) {
    Chat.find().then((chats) => res.send(chats));
  },
};
