const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { ChatController } = require("./chat.controller");
const config = require("../../../config");

const router = express.Router();

router.get(
  "/get-chat-messages",
  auth(config.auth_level.user),
  ChatController.getChatMessages
);

module.exports = router;
