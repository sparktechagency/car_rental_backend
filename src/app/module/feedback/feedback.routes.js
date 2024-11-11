const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { FeedbackController } = require("./feedback.controller");

const router = express.Router();

router
  .post(
    "/post-feedback",
    auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST),
    FeedbackController.postFeedback
  )
  .get(
    "/get-all-feedback",
    auth(ENUM_USER_ROLE.ADMIN),
    FeedbackController.getAllFeedback
  );

module.exports = router;
