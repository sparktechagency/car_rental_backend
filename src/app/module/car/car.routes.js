const auth = require("../../middleware/auth");
const express = require("express");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { uploadFile } = require("../../middleware/fileUploader");
const { CarController } = require("../car/car.controller");

const router = express.Router();

router
  .post(
    "/add-location",
    auth(ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.USER),
    CarController.addLocation
  )
  .patch(
    "/update-car-license",
    auth(ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.USER),
    CarController.updateCarLicense
  )
  .patch(
    "/update-make-model-year",
    auth(ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.USER),
    CarController.updateMakeModelYear
  )
  .patch(
    "/update-transmission",
    auth(ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.USER),
    CarController.updateTransmission
  )
  .patch(
    "/update-host-license",
    auth(ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.USER),
    CarController.updateHostLicense
  )
  .patch(
    "/update-details",
    auth(ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.USER),
    CarController.updateDetails
  )
  .patch(
    "/update-photos",
    auth(ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.USER),
    uploadFile(),
    CarController.updatePhotos
  )
  // .patch(
  //   "/update-host-payment-details",
  //   auth(ENUM_USER_ROLE.HOST),
  //   CarController.updateHostPaymentDetails
  // )
  .patch(
    "/send-add-car-req",
    auth(ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.USER),
    CarController.sendAddCarReq
  )
  .patch(
    "/update-all-car-data",
    auth(ENUM_USER_ROLE.HOST),
    CarController.updateAllCarData
  )
  .get(
    "/get-single-car",
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST),
    CarController.getSingleCar
  )
  .get("/get-my-car", auth(ENUM_USER_ROLE.HOST), CarController.getMyCar)
  .get(
    "/get-all-car",
    auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.ADMIN),
    CarController.getAllCar
  )
  .delete("/delete-car", auth(ENUM_USER_ROLE.ADMIN), CarController.deleteCar);

module.exports = router;
