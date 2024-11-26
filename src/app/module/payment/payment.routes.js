const express = require("express");
const auth = require("../../middleware/auth");
const { ENUM_USER_ROLE } = require("../../../util/enum");
const { PaymentController } = require("./payment.controller");
const { uploadFile } = require("../../middleware/fileUploader");

const router = express.Router();

router
  .get("/pay", PaymentController.payPage)
  .get("/success", PaymentController.successPage)
  .get("/cancel", PaymentController.cancelPage)
  .get(
    "/get-all-payment",
    auth(ENUM_USER_ROLE.ADMIN),
    PaymentController.getAllPayment
  )
  .post(
    "/checkout",
    auth(ENUM_USER_ROLE.USER),
    PaymentController.createCheckout
  )
  .patch("/refund", auth(ENUM_USER_ROLE.ADMIN), PaymentController.refundPayment)
  .get(
    "/host-revenue-chart",
    auth(ENUM_USER_ROLE.HOST),
    PaymentController.hostRevenueChart
  )
  .get(
    "/host-income-details",
    auth(ENUM_USER_ROLE.HOST),
    PaymentController.hostIncomeDetails
  )
  .post(
    "/update-host-payment-details",
    auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST),
    uploadFile(),
    PaymentController.updateHostPaymentDetails
  )
  .get(
    "/get-payout-info",
    auth(ENUM_USER_ROLE.HOST, ENUM_USER_ROLE.ADMIN),
    PaymentController.getPayoutInfo
  )
  .patch(
    "/transfer-payment",
    auth(ENUM_USER_ROLE.ADMIN),
    PaymentController.transferPayment
  );

module.exports = router;
