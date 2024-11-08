const auth = require("../../middleware/auth");
const express = require("express");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { uploadFile } = require("../../middleware/fileUploader");
const { CarController } = require("../car/car.controller");

const router = express.Router();

router
  .post(
    "/add-update-car",
    auth(ENUM_USER_ROLE.HOST),
    uploadFile(),
    CarController.addAndUpdateCar
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
