const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { FavoriteController } = require("./favorite.controller");

const router = express.Router();

router
  .post(
    "/add-remove-favorite",
    auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST),
    FavoriteController.addRemoveFavorite
  )
  .get(
    "/get-my-favorite",
    auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST),
    FavoriteController.getMyFavorite
  );

module.exports = router;
