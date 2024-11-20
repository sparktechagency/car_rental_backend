const ENUM_USER_ROLE = {
  USER: "USER",
  HOST: "HOST",
  ADMIN: "ADMIN",
};

const ENUM_TRIP_STATUS = {
  REQUESTED: "requested",
  CANCELED: "canceled",
  ONGOING: "ongoing",
  COMPLETED: "completed",
};

const ENUM_CAR_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  CANCELED: "canceled",
};

const ENUM_PAYMENT_STATUS = {
  UNPAID: "unpaid",
  SUCCEEDED: "succeeded",
  REFUNDED: "refunded",
};

const ENUM_SOCKET_EVENT = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  ERROR: "error",
  START_CHAT: "start-chat",
  GET_CHAT_MESSAGES: "get-chat-messages",
  SEND_MESSAGE: "send-message",
};

module.exports = {
  ENUM_USER_ROLE,
  ENUM_TRIP_STATUS,
  ENUM_CAR_STATUS,
  ENUM_PAYMENT_STATUS,
  ENUM_SOCKET_EVENT,
};
