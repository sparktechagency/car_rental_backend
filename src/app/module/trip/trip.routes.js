const auth = require("../../middleware/auth");
const express = require("express");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { TripController } = require("../trip/trip.controller");
const config = require("../../../config");

const router = express.Router();

router
  .post("/add-trip", auth(config.auth_level.user), TripController.addTrip)
  .get(
    "/get-my-trip-order",
    auth(config.auth_level.user),
    TripController.getMyTripOrder
  )
  .get(
    "/get-single-trip",
    auth(config.auth_level.user),
    TripController.getSingleTrip
  )
  .get("/get-all-trip", auth(config.auth_level.user), TripController.getAllTrip)
  .patch(
    "/update-trip-status",
    auth(config.auth_level.user),
    TripController.updateTripStatus
  );

module.exports = router;
