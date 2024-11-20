const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { ChatController } = require("./chat.controller");

const router = express.Router();

router.get(
  "/get-chat-messages",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST),
  ChatController.getChatMessages
);

module.exports = router;
