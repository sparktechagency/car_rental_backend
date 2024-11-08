const AdminNotification = require("../app/module/adminNotification/adminNotification.model");
const catchAsync = require("../shared/catchasync");

const postNotification = catchAsync(async (title, message) => {
  if (!title || !message)
    throw new Error("Missing required fields: title, or message");

  await AdminNotification.create({ title, message });
});

module.exports = postNotification;
