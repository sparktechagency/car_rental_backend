const { default: status } = require("http-status");
const { ENUM_SOCKET_EVENT } = require("../util/enum");

const emitError = (
  socket,
  statusCode = status.INTERNAL_SERVER_ERROR,
  message = "Internal sever error",
  disconnect
) => {
  socket.emit(ENUM_SOCKET_EVENT.ERROR, { status: statusCode, message });

  if (disconnect) socket.disconnect(true);
};

module.exports = emitError;
