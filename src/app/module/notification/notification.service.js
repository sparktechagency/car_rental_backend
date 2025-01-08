const QueryBuilder = require("../../../builder/queryBuilder");
const validateFields = require("../../../util/validateFields");
const Notification = require("./notification");

const getAllNotifications = async (user, query) => {
  const workersQuery = new QueryBuilder(
    Notification.find({ toId: user.userId }),
    query
  )
    .search([""])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await workersQuery.modelQuery;
  const meta = await workersQuery.countTotal();

  return { meta, result };
};

const markAsRead = async (user, payload) => {
  validateFields(payload, ["notificationId"]);

  const notification = await Notification.findOneAndUpdate(
    { _id: payload.notificationId, toId: user.userId },
    [{ $set: { isRead: { $not: "$isRead" } } }]
  );

  return notification;
};

const NotificationService = {
  getAllNotifications,
  markAsRead,
};

module.exports = NotificationService;
