const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const NotificationController = require("./notification.controller");

const router = express.Router();

router
  .get(
    "/get-all-notification",
    auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST),
    NotificationController.getAllNotifications
  )
  .patch(
    "/mark-as-read",
    auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST),
    NotificationController.markAsRead
  );

module.exports = router;
