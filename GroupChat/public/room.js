const socket = io("/");
const roomForm = document.querySelector(".roomForm");
const roomBox = document.querySelector(".room-box");

roomForm.addEventListener("submit", (e) => {
    // e.preventDefault();
    const room = e.target.elements.room.value;
    if (room === "") return;
    socket.emit("create-room", room);
    e.target.elements.room.value = "";
    e.target.elements.room.focus();
});

// Registering the room created
socket.on("room-created", (roomName) => {
    const roomElement = document.createElement("div");
    roomElement.innerText = roomName;
    const roomLink = document.createElement("a");
    roomLink.innerText = "Join";
    roomLink.href = `/${roomName}`;
    roomBox.append(roomElement);
    roomBox.append(roomLink);
    // displayMessage("", message);
});