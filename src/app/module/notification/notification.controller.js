const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const NotificationService = require("./notification.service");

const getAllNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getAllNotifications(
    req.user,
    req.query
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications retrieved",
    data: result,
  });
});

const markAsRead = catchAsync(async (req, res) => {
  const result = await NotificationService.markAsRead(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications updated",
    data: result,
  });
});

const deleteNotification = catchAsync(async (req, res) => {
  const result = await NotificationService.deleteNotification(
    req.user,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications deleted",
    data: result,
  });
});

const NotificationController = {
  getAllNotifications,
  markAsRead,
  deleteNotification,
};

module.exports = NotificationController;
