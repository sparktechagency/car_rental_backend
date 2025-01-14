const { PaymentService } = require("./payment.service");
const sendResponse = require("../../../shared/sendResponse");
const catchAsync = require("../../../shared/catchAsync");
const { StripeService } = require("./stripe.service");

const payPage = catchAsync(async (req, res) => {
  res.render("pay.ejs");
});

const successPage = catchAsync(async (req, res) => {
  res.render("success.ejs");
});

const cancelPage = catchAsync(async (req, res) => {
  res.render("cancel.ejs");
});

// const createCheckout = catchAsync(async (req, res) => {
//   const result = await PaymentService.createCheckout(req.user, req.body);
//   res.redirect(result.url);
// });

const createCheckout = catchAsync(async (req, res) => {
  const result = await StripeService.createCheckout(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Checkout Successful",
    data: result,
  });
});

const webhookManager = catchAsync(async (req, res) => {
  const result = await StripeService.webhookManager(req);
  res.send();
});

const getAllPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllPayment(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieval Successful",
    data: result,
  });
});

const refundPayment = catchAsync(async (req, res) => {
  const result = await StripeService.refundPayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment refund Successful",
    data: result,
  });
});

// host only ===========================================================================
const hostRevenueChart = catchAsync(async (req, res) => {
  const result = await PaymentService.hostRevenueChart(req.user, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Host revenue retrieved successfully",
    data: result,
  });
});

const hostIncomeDetails = catchAsync(async (req, res) => {
  const result = await PaymentService.hostIncomeDetails(req.user, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Host income details retrieved successfully",
    data: result,
  });
});

const updateHostPaymentDetails = catchAsync(async (req, res) => {
  const result = await StripeService.updateHostPaymentDetails(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message ? result.message : "Host payment details updated",
    data: result.data ? result.data : result,
  });
});

const getPayoutInfo = catchAsync(async (req, res) => {
  const result = await StripeService.getPayoutInfo(req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Host payout info retrieved",
    data: result,
  });
});

const transferPayment = catchAsync(async (req, res) => {
  const result = await StripeService.transferPayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment transfer successful",
    data: result,
  });
});

const PaymentController = {
  payPage,
  successPage,
  cancelPage,
  createCheckout,
  webhookManager,
  getAllPayment,
  refundPayment,
  hostRevenueChart,
  hostIncomeDetails,
  updateHostPaymentDetails,
  getPayoutInfo,
  transferPayment,
};

module.exports = { PaymentController };
