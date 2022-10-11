const router = require("express").Router();
const { chatController } = require("../../controller/");

router.post("/chats", chatController.create);

router.get("/chats", chatController.find);

module.exports = router;
