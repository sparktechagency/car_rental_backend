const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const QueryBuilder = require("../../../builder/queryBuilder");
const config = require("../../../config");

const stripe = require("stripe")(config.stripe.stripe_secret_key);

const endPointSecret = config.stripe.stripe_webhook_secret;
const cliEndPointSecret = config.stripe.stripe_cli_webhook_secret;

const createCheckout = async (userData, payload) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `http://${config.base_url}:${config.port}/payment/success`,
    cancel_url: `http://${config.base_url}:${config.port}/payment/cancel`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Trip price",
          },
          unit_amount: 50 * 100,
        },
        quantity: 1,
      },
    ],
  });

  return session;
};

const webhookManager2 = async (request) => {
  console.log("hit");
  const sig = request.headers["stripe-signature"];

  let event;

  event = stripe.webhooks.constructEvent(
    request.body,
    sig,
    "whsec_41c71273d0be8064482c15a2abf32a7e71fdfe3a26822a56670657af08b96ec8"
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      console.log(checkoutSessionCompleted);
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      console.log(paymentIntentSucceeded);
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  console.log(event);

  return event;
};

const webhookManager = async (request) => {
  const sig = request.headers["stripe-signature"];
  console.log("webhook hit");

  let event;
  try {
    console.log("try hit");
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      cliEndPointSecret
    );
  } catch (err) {
    console.log("catch hit");
    // console.log(err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  let checkoutSessionCompleted;
  let paymentIntentSucceeded;

  switch (event.type) {
    case "checkout.session.completed":
      checkoutSessionCompleted = event.data.object;
      console.log("checkoutSessionCompleted=============");
      // fn
      break;
    case "payment_intent.succeeded":
      paymentIntentSucceeded = event.data.object;
      console.log("paymentIntentSucceeded=============");
      // fn
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type`);
    // console.log(`Unhandled event type ${event.type}`);
  }

  return event;
};

const getAllFeedback = async (query) => {
  const feedbackQuery = new QueryBuilder(Feedback.find({}), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [result, meta] = await Promise.all([
    feedbackQuery.modelQuery,
    feedbackQuery.countTotal(),
  ]);

  if (!result.length)
    throw new ApiError(status.NOT_FOUND, "Feedback not found");

  return {
    meta,
    result,
  };
};

const PaymentService = {
  webhookManager,
  webhookManager2,
  createCheckout,
  getAllFeedback,
};

module.exports = { PaymentService };
