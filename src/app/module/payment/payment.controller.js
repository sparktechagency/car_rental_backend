const { PaymentService } = require("./payment.service");
const sendResponse = require("../../../shared/sendResponse");
const catchAsync = require("../../../shared/catchasync");

const createCheckout = catchAsync(async (req, res) => {
  const result = await PaymentService.createCheckout(req.user, req.body);

  res.redirect(result.url);

  //   sendResponse(res, {
  //     statusCode: 200,
  //     success: true,
  //     message: "Feedback posted",
  //     data: result,
  //   });
});

const PaymentController = {
  createCheckout,
};

module.exports = { PaymentController };
