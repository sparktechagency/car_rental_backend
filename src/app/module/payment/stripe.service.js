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
const bookingTemp = require("../../../mail/bookingTemp");
const { sendEmail } = require("../../../util/sendEmail");

const stripe = require("stripe")(config.stripe.stripe_secret_key);

const endPointSecret = config.stripe.stripe_webhook_secret;
const cliEndPointSecret = config.stripe.stripe_cli_webhook_secret;

const createCheckout = async (userData, payload) => {
  const { userId } = userData || {};
  const { carId, tripId, amount: prevAmount } = payload || {};
  const amount = Number(prevAmount);
  let session = {};

  validateFields(payload, ["carId", "tripId", "amount"]);

  const [car, trip] = await Promise.all([
    Car.findById(carId),
    Trip.findById(tripId).populate([
      {
        path: "user",
        select: "age",
      },
    ]),
  ]);
  if (!car) throw new ApiError(status.NOT_FOUND, "Car not found");
  if (!trip) throw new ApiError(status.NOT_FOUND, "Trip not found");

  const youngDriverFee = trip.user.age < 25 ? 20 : 0;
  const cleaningFee = amount * 0.055;
  const platformFee = amount * 0.25;
  const hostAmount = amount - platformFee;
  const totalAmount = amount + platformFee + cleaningFee + youngDriverFee;

  const sessionData = {
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
            description: `
            Fees Breakdown • 
            Amount: ${amount} • 
            Platform Fee: ${platformFee} • 
            cleaning Fee: ${cleaningFee} • 
            Young Driver Fee: ${youngDriverFee} 
            `,
          },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      },
    ],
  };

  try {
    session = await stripe.checkout.sessions.create(sessionData);
  } catch (error) {
    throw new ApiError(status.INTERNAL_SERVER_ERROR, error.message);
  }

  const { id: checkout_session_id, url } = session || {};
  const paymentData = {
    user: userId,
    car: carId,
    host: car.user,
    trip: tripId,
    amount,
    hostAmount,
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
  // const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const clientIp = req.headers["x-real-ip"] 
  console.log("x-forwarded-for====================", req.headers["x-forwarded-for"]);
  console.log("remoteAddress====================", req.socket.remoteAddress);
  console.log("headers====================", req.headers);
  // return "";
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
  const [month, day, year] = dateOfBirth.split("/");

  const payoutInfo = await PayoutInfo.findOne({ host: userId });

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
      transfers: {
        requested: true,
      },
    },
    tos_acceptance: {
      date: Math.floor(Date.now() / 1000),
      ip: `${clientIp}`,
      service_agreement: "recipient",
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
    amount: Math.ceil(payment.hostAmount * 100),
    currency: "gbp",
    destination: stripe_account_id,
  };

  const transfer = await stripe.transfers.create(transferObj);

  Promise.all([
    Payment.updateOne(
      { _id: paymentId },
      {
        transferred_amount: payment.hostAmount,
        status: ENUM_PAYMENT_STATUS.TRANSFERRED,
      }
    ),
  ]);

  return {
    hostAmount: payment.hostAmount,
    profit: payment.amount - payment.hostAmount,
  };
};

// utility functions --------------

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
  ).populate([
    {
      path: "user",
      select: "name email",
    },
    {
      path: "host",
      select: "name email",
    },
    {
      path: "car",
      select: "year make model",
    },
  ]);

  await sendBookingMail(updatedPayment, updatedTrip);
};

const updatePaymentRefundToDB = async (refundData) => {
  await Payment.updateOne(
    { payment_intent_id: refundData.payment_intent_id },
    {
      status: ENUM_PAYMENT_STATUS.REFUNDED,
      $inc: { refund_amount: Number(refundData.amount) },
    },
    { timestamps: true }
  );
};

const sendBookingMail = async (updatedPayment, updatedTrip) => {
  const emailData = {
    transactionId: updatedPayment.payment_intent_id,
    name: updatedTrip.user.name,
    hostName: updatedTrip.host.name,
    carName: `${updatedTrip.car.year} ${updatedTrip.car.make} ${updatedTrip.car.model}`,
    startDateTime: `${updatedTrip.tripStartDate} ${updatedTrip.tripStartTime}`,
    endDateTime: `${updatedTrip.tripEndDate} ${updatedTrip.tripEndTime}`,
    pickupLocation: updatedTrip.pickupLocation
      ? updatedTrip.pickupLocation
      : "N/A",
    returnLocation: updatedTrip.returnLocation,
    price: updatedPayment.amount,
    status: updatedTrip.status,
  };

  // sending booking email to both user and host
  try {
    sendEmail({
      email: updatedTrip.user.email,
      subject: "Nardo Booking Details",
      html: bookingTemp(emailData),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, "Email was not sent");
  }

  try {
    sendEmail({
      email: updatedTrip.host.email,
      subject: "Nardo Booking Details",
      html: bookingTemp(emailData),
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(status.INTERNAL_SERVER_ERROR, "Email was not sent");
  }
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
