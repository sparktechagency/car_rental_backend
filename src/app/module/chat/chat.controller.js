const { ChatService } = require("./chat.service");
const sendResponse = require("../../../shared/sendResponse");
const catchAsync = require("../../../shared/catchAsync");

const getChatMessages = catchAsync(async (req, res) => {
  const result = await ChatService.getChatMessages(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chats retrieved",
    data: result,
  });
});

const ChatController = {
  getChatMessages,
};

module.exports = { ChatController };
