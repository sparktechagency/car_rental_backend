const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const validateFields = require("../../../util/validateFields");
const Chat = require("./chat.model");

const getChatMessages = async (payload) => {
  const { chatId } = payload;

  validateFields(payload, ["chatId"]);

  const chat = await Chat.findById(chatId)
    .populate({
      path: "participants",
      select: "name profile_image phone_number",
    })
    .populate({
      path: "messages",
      select: "sender receiver message createdAt",
      options: { sort: { createdAt: -1 } },
    })
    .lean();

  if (!chat) throw new ApiError(status.NOT_FOUND, "No chat found");

  return chat;
};

const ChatService = {
  getChatMessages,
};

module.exports = { ChatService };
