const { default: status } = require("http-status");
const validateFields = require("../util/validateFields");
const ApiError = require("../error/ApiError");
const Message = require("../app/module/chat/message.model");
const Chat = require("../app/module/chat/chat.model");
const postNotification = require("../util/postNotification");
const User = require("../app/module/user/user.model");
const { ENUM_USER_ROLE } = require("../util/enum");

const startChat = async (payload) => {
  const { userId, receiverId } = payload;

  validateFields(payload, ["receiverId"]);

  const existingChat = await Chat.findOne({
    participants: { $all: [userId, receiverId] },
  });

  if (existingChat) return existingChat;

  const newChat = await Chat.create({
    participants: [userId, receiverId],
    messages: [],
  });

  postNotification(
    "New message",
    "You have started a new conversation",
    receiverId
  );
  postNotification(
    "New message",
    "You have started a new conversation",
    userId
  );

  return newChat;
};

const sendMessage = async (payload) => {
  const { userId, receiverId, chatId, message } = payload;

  validateFields(payload, ["receiverId", "chatId", "message"]);

  const existingChat = await Chat.findOne({
    _id: chatId,
    participants: { $all: [userId, receiverId] },
  });

  const user = await User.findById(userId);

  if (!existingChat) throw new ApiError(status.BAD_REQUEST, "No chat found");

  const newMessage = await Message.create({
    sender: userId,
    receiver: receiverId,
    message,
  });

  // notify both user and host upon new message
  postNotification(
    `New message. For Renters go to Trips > Current. For Hosts go to Host History > Ongoing`,
    message,
    receiverId
  );
  postNotification(
    `New message. For Renters go to Trips > Current. For Hosts go to Host History > Ongoing`,
    message,
    userId
  );

  Promise.all([
    Chat.updateOne({ _id: chatId }, { $push: { messages: newMessage._id } }),
  ]);

  return newMessage;
};

const ChatSocket = {
  startChat,
  sendMessage,
};

module.exports = { ChatSocket };
