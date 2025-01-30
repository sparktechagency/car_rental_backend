const { status } = require("http-status");
const cron = require("node-cron");

const ApiError = require("../../../error/ApiError");
const config = require("../../../config");
const validateFields = require("../../../util/validateFields");
const Car = require("../car/car.model");
const Payment = require("./payment.model");
const { ENUM_PAYMENT_STATUS } = require("../../../util/enum");
const catchAsync = require("../../../shared/catchAsync");
const { logger } = require("../../../shared/logger");
const User = require("../user/user.model");
const PayoutInfo = require("./payoutInfo.model");
const dateTimeValidator = require("../../../util/dateTimeValidator");
const Trip = require("../trip/trip.model");

const stripe = require("stripe")(config.stripe.stripe_secret_key);

const endPointSecret = config.stripe.stripe_webhook_secret;
const cliEndPointSecret = config.stripe.stripe_cli_webhook_secret;

const createCheckout = async (userData, payload) => {
  const { userId } = userData || {};
  const { carId, tripId, amount } = payload || {};
  let session = {};
  let car = {};
  let trip = {};

  validateFields(payload, ["carId", "tripId", "amount"]);

  try {
    [car, trip, session] = await Promise.all([
      Car.findById(carId),
      Trip.findById(tripId),
      stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `http://${config.base_url}:${config.port}/payment/success`,
        cancel_url: `http://${config.base_url}:${config.port}/payment/cancel`,
        line_items: [
          {
            price_data: {
              currency: "gbp",
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
  if (!trip) throw new ApiError(status.NOT_FOUND, "Trip not found");

  const { id: checkout_session_id, url } = session || {};
  const paymentData = {
    user: userId,
    car: carId,
    host: car.user,
    trip: tripId,
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
      updatePaymentToDB(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

const refundPayment = async (payload) => {
  const { payment_intent_id, amount } = payload;

  validateFields(payload, ["payment_intent_id", "amount"]);

  const refund = await stripe.refunds.create({
    payment_intent: payment_intent_id,
    amount: Number(amount) * 100,
  });

  updatePaymentRefundToDB({ payment_intent_id, amount });

  return {
    status: refund.status,
    amount: refund.amount / 100,
    currency: refund.currency,
  };
};

const updateHostPaymentDetails = async (req) => {
  const { user: userData, body: payload } = req;
  const { userId, email } = userData;
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const {
    website_url: url,
    first_name,
    last_name,
    phone,
    bank_account_no,
    dateOfBirth,
    line1,
    city,
    postal_code,
  } = payload || {};

  validateFields(payload, [
    "website_url",
    "first_name",
    "last_name",
    "phone",
    "dateOfBirth",
    "line1",
    "city",
    "postal_code",
    "bank_account_no",
  ]);

  dateTimeValidator(dateOfBirth);
  const [day, month, year] = dateOfBirth.split("/");

  const payoutInfo = await getPayoutInfo(userData);

  if (payoutInfo)
    return { message: "Payout info already exists", data: payoutInfo };

  const stripeAccountData = {
    type: "custom",
    country: "GB",
    email,
    business_profile: {
      mcc: "5734",
      url,
    },
    business_type: "individual",
    individual: {
      first_name,
      last_name,
      email,
      phone,
      dob: {
        day,
        month,
        year,
      },
      address: {
        line1,
        city,
        postal_code,
        country: "GB",
      },
    },
    external_account: {
      object: "bank_account",
      account_number: bank_account_no,
      country: "GB",
      currency: "gbp",
    },
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
    tos_acceptance: {
      date: Math.floor(Date.now() / 1000),
      ip: `${clientIp}`,
    },
  };

  const account = await stripe.accounts.create(stripeAccountData);
  console.log(account);
  const payoutData = {
    host: userId,
    stripe_account_id: account.id,
    bank_account_no,
  };

  const newPayoutInfo = await PayoutInfo.create(payoutData);

  return newPayoutInfo;
};

const getPayoutInfo = async (userData) => {
  const { userId } = userData;

  const existingPayoutInfo = await PayoutInfo.findOne({ host: userId });
  if (!existingPayoutInfo)
    throw new ApiError(status.NOT_FOUND, "Pay out info does not exist");

  return existingPayoutInfo;
};

const transferPayment = async (payload) => {
  const { paymentId } = payload;

  validateFields(payload, ["paymentId"]);

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiError(status.NOT_FOUND, "Payment not found");

  const hostPayoutInfo = await PayoutInfo.findOne({ host: payment.host });
  if (!hostPayoutInfo)
    throw new ApiError(status.NOT_FOUND, "Host payout info does not exist");
  const { stripe_account_id } = hostPayoutInfo;

  const transferObj = {
    amount: Math.ceil(payment.amount * 100 * 0.9),
    currency: "gbp",
    destination: stripe_account_id,
    // amount: Math.ceil(20 * 100 * 0.9),
    // currency: "usd",
    // destination: "acct_1QOI4tBA1SkqjBUj",
  };

  const transfer = await stripe.transfers.create(transferObj);

  const [payouts, accountBalance] = await Promise.all([
    stripe.payouts.list({
      stripeAccount: stripe_account_id,
    }),
    stripe.balance.retrieve({
      stripeAccount: stripe_account_id,
    }),
  ]);

  console.log(payouts, accountBalance);

  Promise.all([
    Payment.updateOne(
      { _id: paymentId },
      {
        transferred_amount: payment.amount * 0.9,
        status: ENUM_PAYMENT_STATUS.TRANSFERRED,
      }
    ),
  ]);

  return {
    amount: payment.amount * 0.9,
    profit: payment.amount * 0.1,
  };
};

const updatePaymentToDB = async (eventData) => {
  const { id, payment_intent } = eventData;

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

  const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);

  const updatedPayment = await Payment.findOneAndUpdate(
    { checkout_session_id: id },
    {
      $set: {
        payment_intent_id: payment_intent,
        status: ENUM_PAYMENT_STATUS.SUCCEEDED,
        receipt_url: charge.receipt_url,
      },
    },
    { new: true, runValidators: true }
  );
  const updatedTrip = await Trip.findOneAndUpdate(
    { _id: updatedPayment.trip },
    { $set: { isPaid: true } },
    { new: true, runValidators: true }
  );
};

const updatePaymentRefundToDB = async (refundData) => {
  await Payment.updateOne(
    { payment_intent_id: refundData.payment_intent_id },
    {
      $inc: { refund_amount: Number(refundData.amount) },
    },
    { timestamps: true }
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

const StripeService = {
  webhookManager,
  createCheckout,
  refundPayment,
  getPayoutInfo,
  updateHostPaymentDetails,
  transferPayment,
};

module.exports = { StripeService };
