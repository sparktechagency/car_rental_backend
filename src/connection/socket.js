const { Server } = require("socket.io");
const http = require("http");
const app = require("../app");
const server = http.createServer(app);

let io;

io = new Server(server, {
  cors: true,
});

io.on("connection", (socket) => {
  console.log("connection ID:", socket.id);

  socket.on("disconnect", () => {
    console.log("disconnected ID:", socket.id);
  });
});

module.exports = { server };
