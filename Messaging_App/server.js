// Importing the module && setting up the server
const io = require("socket.io")(5000, {
  cors: {
    origin: ["http://localhost:5500"],
  },
});

const users = {};

// Client connection event with socket
io.on("connection", (socket) => {
  // Connect event when user reconnects
  socket.on("connection-on", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("reconnected", {
      username: users[socket.id],
      message: `${name}, Re-Join the Session`,
    });
  });

  // Joining the new users
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", {
      username: users[socket.id],
      message: `${name} Joined`,
    });
  });

  // Send data to all the connected users
  socket.on("send-chat-message", (name, msg) => {
    users[socket.id] = name;
    socket.broadcast.emit("receive-chat-message", {
      username: users[socket.id],
      message: msg,
    });
  });

  // Disconnect event when user leftoff
  socket.on("connection-off", (name) => {
    socket.broadcast.emit("leftoff", {
      username: users[socket.id],
      message: `${name} Left the Session`,
    });
    // delete users[socket.id];
  });
});
