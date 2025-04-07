const auth = require("../../middleware/auth");
const express = require("express");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const DashboardController = require("./dashboard.controller");
const { uploadFile } = require("../../middleware/fileUploader");
const config = require("../../../config");

const router = express.Router();

router

  // car ===============================
  .get(
    "/get-all-add-car-req",
    auth(config.auth_level.admin),
    DashboardController.getAllAddCarReq
  )
  .patch(
    "/approve-car",
    auth(config.auth_level.admin),
    DashboardController.approveCar
  )

  // destination ========================
  .post(
    "/add-destination",
    auth(config.auth_level.admin),
    uploadFile(),
    DashboardController.addDestination
  )
  .get("/get-all-destination", DashboardController.getAllDestination)
  .delete(
    "/delete-destination",
    auth(config.auth_level.admin),
    DashboardController.deleteDestination
  )

  // overview ========================
  .get(
    "/total-overview",
    auth(config.auth_level.admin),
    DashboardController.totalOverview
  )
  .get("/revenue", auth(config.auth_level.admin), DashboardController.revenue)
  .get("/growth", auth(config.auth_level.admin), DashboardController.growth)

  // user-host management ========================
  .get(
    "/get-all-user",
    auth(config.auth_level.admin),
    DashboardController.getAllUser
  )
  .get(
    "/get-user-details",
    auth(config.auth_level.admin),
    DashboardController.getSingleUser
  )
  .patch(
    "/block-unblock-user",
    auth(config.auth_level.admin),
    DashboardController.blockUnblockUser
  )
  .delete(
    "/delete-user",
    auth(config.auth_level.admin),
    DashboardController.deleteUser
  );

module.exports = router;
