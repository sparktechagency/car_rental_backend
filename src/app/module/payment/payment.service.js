const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const QueryBuilder = require("../../../builder/queryBuilder");
const config = require("../../../config");

const stripe = require("stripe")(config.stripe.stripe_secret_key);

const createCheckout = async (userData, payload) => {
  const session = await stripe.checkout.sessions.create({
    success_url: `http://${config.base_url}:${config.port}/payment/success`,
    // success_url: `http://localhost:3000/success`,
    cancel_url: "http://example.com/payment/cancel",
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
    mode: "payment",
  });

  return session;
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
  createCheckout,
  getAllFeedback,
};

module.exports = { PaymentService };
