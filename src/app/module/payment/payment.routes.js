const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { PaymentController } = require("./payment.controller");
const bodyParser = require("body-parser");

const router = express.Router();

router
  .get("/pay", PaymentController.payPage)

  .get("/success", PaymentController.successPage)

  .get("/cancel", PaymentController.cancelPage)

  .post("/checkout", PaymentController.createCheckout)

  // .post(
  //   "/webhook",
  //   express.raw({ type: "application/json" }),
  //   PaymentController.webhookManager
  // );

module.exports = router;
