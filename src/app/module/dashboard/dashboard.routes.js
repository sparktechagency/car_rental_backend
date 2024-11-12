const auth = require("../../middleware/auth");
const express = require("express");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const DashboardController = require("./dashboard.controller");
const { uploadFile } = require("../../middleware/fileUploader");

const router = express.Router();

router

  // car ===============================
  .get(
    "/get-all-add-car-req",
    auth(ENUM_USER_ROLE.ADMIN),
    DashboardController.getAllAddCarReq
  )
  .patch(
    "/approve-car",
    auth(ENUM_USER_ROLE.ADMIN),
    DashboardController.approveCar
  )

  // destination ========================
  .post(
    "/add-destination",
    auth(ENUM_USER_ROLE.ADMIN),
    uploadFile(),
    DashboardController.addDestination
  )
  .get(
    "/get-all-destination",
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.USER),
    DashboardController.getAllDestination
  )
  .delete(
    "/delete-destination",
    auth(ENUM_USER_ROLE.ADMIN),
    DashboardController.deleteDestination
  )

  // overview ========================
  .get(
    "/total-overview",
    auth(ENUM_USER_ROLE.ADMIN),
    DashboardController.totalOverview
  )
  .get("/revenue", auth(ENUM_USER_ROLE.ADMIN), DashboardController.revenue);

module.exports = router;
