const { default: status } = require("http-status");
const { ENUM_SOCKET_EVENT } = require("../util/enum");
const { ChatSocket } = require("./chat.socket");
const emitError = require("./emitError.socket");
const User = require("../app/module/user/user.model");
const postNotification = require("../util/postNotification");

const validateUser = async (socket, userId) => {
  if (!userId) {
    emitError(
      socket,
      status.BAD_REQUEST,
      "userId is required to connect",
      "disconnect"
    );
    return null;
  }

  const user = await User.findById(userId);
  if (!user) {
    emitError(socket, status.NOT_FOUND, "User not found", "disconnect");
    return null;
  }

  return user;
};

const startChat = async (socket, io, userId, data) => {
  try {
    const result = await ChatSocket.startChat({ userId, ...data });
    socket.emit(ENUM_SOCKET_EVENT.START_CHAT, { status: status.OK, result });
  } catch (error) {
    emitError(socket, error.statusCode || 500, error.message);
  }
};

const sendMessage = async (socket, io, userId, data) => {
  try {
    const result = await ChatSocket.sendMessage({ userId, ...data });

    io.to(userId).emit(ENUM_SOCKET_EVENT.SEND_MESSAGE, {
      status: status.OK,
      result,
    });
    io.to(data.receiverId).emit(ENUM_SOCKET_EVENT.SEND_MESSAGE, {
      status: status.OK,
      result,
    });
  } catch (error) {
    console.log(error);
    emitError(socket, error.StatusCode, error.message);
  }
};

const Controller = {
  startChat,
  sendMessage,
  validateUser,
};

module.exports = Controller;
