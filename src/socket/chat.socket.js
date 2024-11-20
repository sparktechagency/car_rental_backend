const { default: status } = require("http-status");
const validateFields = require("../util/validateFields");
const ApiError = require("../error/ApiError");
const Message = require("../app/module/chat/message.model");
const Chat = require("../app/module/chat/chat.model");
const postNotification = require("../util/postNotification");

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

  postNotification("New message", "You received new message", receiverId);

  return newChat;
};

const sendMessage = async (payload) => {
  const { userId, receiverId, chatId, message } = payload;

  validateFields(payload, ["receiverId", "chatId", "message"]);

  const existingChat = await Chat.findOne({
    _id: chatId,
    participants: { $all: [userId, receiverId] },
  });

  if (!existingChat) throw new ApiError(status.BAD_REQUEST, "No chat found");

  const newMessage = await Message.create({
    sender: userId,
    receiver: receiverId,
    message,
  });

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
