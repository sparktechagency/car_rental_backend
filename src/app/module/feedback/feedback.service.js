const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const Feedback = require("./feedback.model");
const QueryBuilder = require("../../../builder/queryBuilder");
const postNotification = require("../../../util/postNotification");
const validateFields = require("../../../util/validateFields");

const postFeedback = async (userData, payload) => {
  const { userId } = userData;
  const feedbackData = { user: userId, ...payload };

  validateFields(payload, ["subject", "feedback"]);

  const result = await Feedback.create(feedbackData);

  postNotification("Thank You", "Thank you for your valuable feedback", userId);
  postNotification("New Feedback", "A user has given feedback on Nardo.");

  return result;
};

const getAllFeedback = async (query) => {
  const feedbackQuery = new QueryBuilder(
    Feedback.find({}).populate([
      {
        path: "user",
        select: "email name email age profile_image phone_number address",
      },
    ]),
    query
  )
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

const FeedbackService = {
  postFeedback,
  getAllFeedback,
};

module.exports = { FeedbackService };
