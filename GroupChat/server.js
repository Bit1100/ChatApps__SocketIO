// Importing various common node modules
const path = require("path");

// importing && initializing the app\
const express = require("express");
const app = express();

// Creating the server
const server = require("http").createServer(app);

// Importing the class for user manipulation
const UM = require("./utils/users");

const formatMessage = require("./utils/function");
const botName = "Roboto";

// Setting the views and templating language
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// using middleware to receive form data
app.use(express.urlencoded({ extended: true }));

// Importing the module && setting up the server
const io = require("socket.io")(server);

// using static files middlewares
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
    res.render("index", { rooms: UM.getAllRooms().rooms });
});

app.post("/", (req, res) => {
    res.redirect("/");
});

app.get("/:room", (req, res) => {
    const roomName = req.params.room;
    if (UM.getRoom(roomName).room === undefined) {
        return res.redirect("/");
    }
    res.render("room", { roomName });
});

// Room connection event with socket
io.on("connection", (socket) => {
    // Send data to all the connected users
    socket.on("create-room", (room) => {
        const roomName = UM.addRoom(room);
        io.emit("room-created", roomName);
    });

    // Joining the new user
    socket.on("new-user", (room, name) => {
        // Storing the user
        const user = UM.addUser(socket.id, name, room);

        // Joining user to room
        socket.join(user.room);

        // Message to the users except by the Bot
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(botName, `${user.username} has joined the room`)
            );

        // Message to the user by the Bot
        socket.emit(
            "message",
            formatMessage(botName, `Welcome to the Room, ${user.username}`)
        );
    });

    // Send data to all the connected users
    socket.on("chat-message", (msg) => {
        const user = UM.getUser(socket.id);
        console.log(user);
        socket.broadcast
            .to(user.room)
            .emit("message", formatMessage(user.username, msg));

        // Message to the user by the Bot
        socket.emit("message", formatMessage(user.username, msg, "sender"));
    });

    // Disconnect event when user leftoff
    socket.on("leave-room", () => {
        const user = UM.deleteUser(socket.id);

        // Message to the users except by the Bot
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(botName, `${user.username} has left the room`)
            );

        // Message to the user by the Bot
        socket.emit(
            "message",
            formatMessage(botName, `${user.username},You left the room`, "sender")
        );
    });
});

// App listening to the port
const port = process.env.PORT || 3000;
server.listen(port, (err) => {
    err && console.log(err);
    console.log(`Server is listening at port: ${port}`);
});