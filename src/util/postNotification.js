const AdminNotification = require("../app/module/adminNotification/adminNotification.model");
const Notification = require("../app/module/notification/notification");
const catchAsync = require("../shared/catchasync");

const postNotification = catchAsync(async (title, message, toId = null) => {
  if (!title || !message)
    throw new Error("Missing required fields: title, or message");

  if (!toId) await AdminNotification.create({ title, message });
  else await Notification.create({ toId, title, message });
});

module.exports = postNotification;
