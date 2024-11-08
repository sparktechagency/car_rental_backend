const auth = require("../../middleware/auth");
const express = require("express");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { TripController } = require("../trip/trip.controller");

const router = express.Router();

router
  .post("/add-trip", auth(ENUM_USER_ROLE.USER), TripController.addTrip)
  .get(
    "/get-my-trip-order",
    auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST),
    TripController.getMyTripOrder
  )
  .get(
    "/get-single-trip",
    auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.ADMIN),
    TripController.getSingleTrip
  )
  .get("/get-all-trip", auth(ENUM_USER_ROLE.ADMIN), TripController.getAllTrip)
  .patch(
    "/update-trip-status",
    auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST),
    TripController.updateTripStatus
  );

module.exports = router;
