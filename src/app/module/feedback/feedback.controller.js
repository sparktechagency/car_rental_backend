const { FeedbackService } = require("./feedback.service");
const sendResponse = require("../../../shared/sendResponse");
const catchAsync = require("../../../shared/catchAsync");

const postFeedback = catchAsync(async (req, res) => {
  const result = await FeedbackService.postFeedback(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Feedback posted",
    data: result,
  });
});

const getAllFeedback = catchAsync(async (req, res) => {
  const result = await FeedbackService.getAllFeedback(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Feedback retrieved",
    data: result,
  });
});

const FeedbackController = {
  postFeedback,
  getAllFeedback,
};

module.exports = { FeedbackController };
