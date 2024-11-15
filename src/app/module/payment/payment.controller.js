const { PaymentService } = require("./payment.service");
const sendResponse = require("../../../shared/sendResponse");
const catchAsync = require("../../../shared/catchasync");

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
  const result = await PaymentService.createCheckout(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Checkout Successful",
    data: result,
  });
});

const webhookManager = catchAsync(async (req, res) => {
  const result = await PaymentService.webhookManager(req);
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
  const result = await PaymentService.refundPayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieval Successful",
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
};

module.exports = { PaymentController };
