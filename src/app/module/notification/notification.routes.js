const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const NotificationController = require("./notification.controller");
const config = require("../../../config");

const router = express.Router();

router
  .get(
    "/get-all-notification",
    auth(config.auth_level.user),
    NotificationController.getAllNotifications
  )
  .patch(
    "/mark-as-read",
    auth(config.auth_level.user),
    NotificationController.markAsRead
  )

  .delete(
    "/delete-notification",
    auth(config.auth_level.user),
    NotificationController.deleteNotification
  );

module.exports = router;
