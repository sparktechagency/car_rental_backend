const { Server } = require("socket.io");
const http = require("http");
const app = require("../app");
const { ENUM_SOCKET_EVENT } = require("../util/enum");
const Controller = require("../socket/controller.socket");
const server = http.createServer(app);

let io;

io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://178.128.174.197:8003",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  },
});

io.on(ENUM_SOCKET_EVENT.CONNECTION, async (socket) => {
  const userId = socket.handshake.query.userId || null;

  const user = await Controller.validateUser(socket, userId);
  if (!user) return;

  socket.join(userId);

  socket.on(ENUM_SOCKET_EVENT.START_CHAT, async (data) => {
    Controller.startChat(socket, io, userId, data);
  });

  socket.on(ENUM_SOCKET_EVENT.SEND_MESSAGE, async (data) => {
    Controller.sendMessage(socket, io, userId, data);
  });

  console.log("connection===================================", userId);

  socket.on(ENUM_SOCKET_EVENT.DISCONNECT, () => {
    console.log("disconnected===============================", userId);
  });
});

module.exports = { server };
