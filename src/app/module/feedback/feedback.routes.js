const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { FeedbackController } = require("./feedback.controller");
const config = require("../../../config");

const router = express.Router();

router
  .post(
    "/post-feedback",
    auth(config.auth_level.user),
    FeedbackController.postFeedback
  )
  .get(
    "/get-all-feedback",
    auth(config.auth_level.admin),
    FeedbackController.getAllFeedback
  );

module.exports = router;
