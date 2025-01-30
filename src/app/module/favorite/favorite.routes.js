const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { FavoriteController } = require("./favorite.controller");
const config = require("../../../config");

const router = express.Router();

router
  .post(
    "/add-remove-favorite",
    auth(config.auth_level.user),
    FavoriteController.addRemoveFavorite
  )
  .get(
    "/get-my-favorite",
    auth(config.auth_level.user),
    FavoriteController.getMyFavorite
  );

module.exports = router;
