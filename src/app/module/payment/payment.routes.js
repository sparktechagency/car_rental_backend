const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { PaymentController } = require("./payment.controller");
const { uploadFile } = require("../../middleware/fileUploader");
const config = require("../../../config");

const router = express.Router();

router
  .get("/pay", PaymentController.payPage)
  .get("/success", PaymentController.successPage)
  .get("/cancel", PaymentController.cancelPage)
  .get(
    "/get-all-payment",
    auth(config.auth_level.admin),
    PaymentController.getAllPayment
  )
  .post(
    "/checkout",
    auth(config.auth_level.user),
    PaymentController.createCheckout
  )
  .patch(
    "/refund",
    auth(config.auth_level.admin),
    PaymentController.refundPayment
  )
  .get(
    "/host-revenue-chart",
    auth(config.auth_level.host),
    PaymentController.hostRevenueChart
  )
  .get(
    "/host-income-details",
    auth(config.auth_level.host),
    PaymentController.hostIncomeDetails
  )
  .post(
    "/update-host-payment-details",
    auth(config.auth_level.user),
    uploadFile(),
    PaymentController.updateHostPaymentDetails
  )
  .get(
    "/get-payout-info",
    auth(config.auth_level.user),
    PaymentController.getPayoutInfo
  )
  .patch(
    "/transfer-payment",
    auth(config.auth_level.user),
    PaymentController.transferPayment
  );

module.exports = router;
