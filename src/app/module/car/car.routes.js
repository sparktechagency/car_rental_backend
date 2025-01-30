const auth = require("../../middleware/auth");
const express = require("express");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { uploadFile } = require("../../middleware/fileUploader");
const { CarController } = require("../car/car.controller");
const config = require("../../../config");

const router = express.Router();

router
  .post(
    "/add-location",
    auth(config.auth_level.user),
    CarController.addLocation
  )
  .patch(
    "/update-car-license",
    auth(config.auth_level.user),
    CarController.updateCarLicense
  )
  .patch(
    "/update-make-model-year",
    auth(config.auth_level.user),
    CarController.updateMakeModelYear
  )
  .patch(
    "/update-transmission",
    auth(config.auth_level.user),
    CarController.updateTransmission
  )
  .patch(
    "/update-host-license",
    auth(config.auth_level.user),
    uploadFile(),
    CarController.updateHostLicense
  )
  .patch(
    "/update-details",
    auth(config.auth_level.user),
    CarController.updateDetails
  )
  .patch(
    "/update-photos",
    auth(config.auth_level.user),
    uploadFile(),
    CarController.updatePhotos
  )
  .patch(
    "/send-add-car-req",
    auth(config.auth_level.user),
    CarController.sendAddCarReq
  )
  .patch(
    "/update-all-car-data",
    auth(config.auth_level.host),
    CarController.updateAllCarData
  )
  .get("/get-all-brands", CarController.getAllBrands)
  .get(
    "/get-single-car-details",
    auth(config.auth_level.user, false),
    CarController.getSingleCar
  )
  .get("/get-my-car", auth(config.auth_level.host), CarController.getMyCar)
  .get(
    "/get-all-car",
    auth(config.auth_level.user, false),
    CarController.getAllCar
  )
  .get("/get-make-model-year", CarController.getDistinctMakeModelYear)
  .get("/top-hosts-in-destination", CarController.topHostsInDestination)
  .delete("/delete-car", auth(config.auth_level.admin), CarController.deleteCar)
  .get(
    "/get-make-from-api",
    auth(config.auth_level.user),
    CarController.getMakeFromAPI
  )
  .get(
    "/get-model-from-api",
    auth(config.auth_level.user),
    CarController.getModelFromAPI
  );

module.exports = router;
