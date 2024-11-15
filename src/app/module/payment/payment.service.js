const { status } = require("http-status");
const cron = require("node-cron");

const ApiError = require("../../../error/ApiError");
const QueryBuilder = require("../../../builder/queryBuilder");
const config = require("../../../config");
const validateFields = require("../../../util/validateFields");
const Car = require("../car/car.model");
const Payment = require("./payment.model");
const { ENUM_PAYMENT_STATUS } = require("../../../util/enum");
const catchAsync = require("../../../shared/catchasync");
const { logger } = require("../../../shared/logger");

const stripe = require("stripe")(config.stripe.stripe_secret_key);

const endPointSecret = config.stripe.stripe_webhook_secret;
const cliEndPointSecret = config.stripe.stripe_cli_webhook_secret;
const sessionAndIntentId = {};

const createCheckout = async (userData, payload) => {
  const { userId } = userData || {};
  const { carId, amount } = payload || {};
  let session = {};
  let car = {};

  validateFields(payload, ["carId", "amount"]);

  try {
    [car, session] = await Promise.all([
      Car.findById(carId),
      stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `http://${config.base_url}:${config.port}/payment/success`,
        cancel_url: `http://${config.base_url}:${config.port}/payment/cancel`,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Trip Cost",
              },
              unit_amount: Number(amount) * 100,
            },
            quantity: 1,
          },
        ],
      }),
    ]);
  } catch (error) {
    throw new ApiError(status.INTERNAL_SERVER_ERROR, error.message);
  }

  if (!car) throw new ApiError(status.NOT_FOUND, "Car not found");

  const { id: checkout_session_id, url } = session || {};
  const paymentData = {
    user: userId,
    car: carId,
    host: car.user,
    amount,
    checkout_session_id,
  };

  await Payment.create(paymentData);

  return url;
};

const webhookManager = async (request) => {
  const sig = request.headers["stripe-signature"];
  let event;

  console.log("webhook hit");

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      cliEndPointSecret
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      sessionAndIntentId.checkout_session_id = event.data.object.id;
      break;
    case "payment_intent.succeeded":
      sessionAndIntentId.payment_intent_id = event.data.object.id;
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  if (
    sessionAndIntentId.checkout_session_id &&
    sessionAndIntentId.payment_intent_id
  ) {
    updatePaymentToDB(sessionAndIntentId);
    sessionAndIntentId.checkout_session_id = null;
    sessionAndIntentId.payment_intent_id = null;
  }
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

const updatePaymentToDB = async (sessionAndIntentId) => {
  const { checkout_session_id, payment_intent_id } = sessionAndIntentId;

  await Payment.updateOne(
    { checkout_session_id },
    { $set: { payment_intent_id, status: ENUM_PAYMENT_STATUS.SUCCEEDED } },
    { new: true, runValidators: true }
  );
};

// Delete unpaid payments every day at midnight
cron.schedule(
  "0 0 * * *",
  catchAsync(async () => {
    const result = await Payment.deleteMany({
      status: ENUM_PAYMENT_STATUS.UNPAID,
    });

    if (result.deletedCount > 0) {
      logger.info(`Deleted ${result.deletedCount} unpaid payments`);
    }
  })
);

const PaymentService = {
  webhookManager,
  createCheckout,
  getAllFeedback,
};

module.exports = { PaymentService };
