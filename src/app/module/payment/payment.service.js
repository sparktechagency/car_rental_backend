const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const QueryBuilder = require("../../../builder/queryBuilder");
const config = require("../../../config");

const stripe = require("stripe")(config.stripe.stripe_secret_key);

const endPointSecret = config.stripe.stripe_webhook_secret;

const createCheckout = async (userData, payload) => {
  const session = await stripe.checkout.sessions.create({
    // payment_method_types: ["card"],
    mode: "payment",
    success_url: `http://${config.base_url}:${config.port}/payment/success`,
    cancel_url: `http://${config.base_url}:${config.port}/payment/cancel`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Node.js and Express book",
          },
          unit_amount: 50 * 100,
        },
        quantity: 1,
      },
    ],
  });

  // console.log(session);

  return session;
};

const webhookManager = async (request) => {
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
  createCheckout,
  getAllFeedback,
};

module.exports = { PaymentService };
