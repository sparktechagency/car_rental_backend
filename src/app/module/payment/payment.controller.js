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

const createCheckout = catchAsync(async (req, res) => {
  const result = await PaymentService.createCheckout(req.user, req.body);

  res.redirect(result.url);
});

const webhookManager = catchAsync(async (req, res) => {
  const result = await PaymentService.webhookManager(req);

  res.send("done");
  // res.redirect(result.url);

  // const stripe = require("stripe")(config.stripe.stripe_secret_key);
  // const endpointSecret = "whsec_dHytLbwKnafJ14q3wcMhCKtSR77Bq2nQ";

  // app.post(
  //   "/webhook",
  //   express.raw({ type: "application/json" }),
  //   (request, response) => {
  //     const sig = request.headers["stripe-signature"];

  //     let event;

  //     try {
  //       event = stripe.webhooks.constructEvent(
  //         request.body,
  //         sig,
  //         endpointSecret
  //       );
  //     } catch (err) {
  //       response.status(400).send(`Webhook Error: ${err.message}`);
  //       return;
  //     }

  //     // Handle the event
  //     console.log(`Unhandled event type ${event.type}`);

  //     // Return a 200 response to acknowledge receipt of the event
  //     response.send();
  //   }
  // );
});

const PaymentController = {
  payPage,
  successPage,
  cancelPage,
  createCheckout,
  webhookManager,
};

module.exports = { PaymentController };
