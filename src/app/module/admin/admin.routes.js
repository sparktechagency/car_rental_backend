const auth = require("../../middleware/auth");
const express = require("express");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { uploadFile } = require("../../middleware/fileUploader");
const { AdminController } = require("../admin/admin.controller");
const config = require("../../../config");

const router = express.Router();

router
  .get("/profile", auth(config.auth_level.admin), AdminController.getProfile)
  .patch(
    "/edit-profile",
    auth(config.auth_level.admin),
    uploadFile(),
    AdminController.updateProfile
  )
  .delete(
    "/delete-account",
    auth(config.auth_level.admin),
    AdminController.deleteMyAccount
  );

module.exports = router;
