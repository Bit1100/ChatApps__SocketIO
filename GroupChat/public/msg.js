// Creating socket
const socket = io("/");
const msgContainer = document.querySelector(".message-container");
const form = document.querySelector("#form");
const msgBox = document.querySelector(".message-box");
const disconnectBtn = document.querySelector(".disconnect-btn");
let name;

// Won't exit prompt until you entered you name
do {
    name = prompt("Enter your name:");
} while (!name);

// New User Joining Event Fired
if (name) {
    socket.emit("new-user", roomName, name.trim());
}

// Submitting the form
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    if (msg === "") return;
    if (socket.connected) {
        socket.emit("chat-message", msg);
        e.target.elements.msg.value = "";
        e.target.elements.msg.focus();
    }
});

// Registering the user connection event
socket.on("message", (data) => {
    const { username, msg, time, sender } = data;
    displayMessage(username, msg, time, sender);
    msgBox.scrollTop = msgBox.scrollHeight;
});

// Showing incoming/outgoing message
function displayMessage(username, msg, time, userType = "") {
    const div = document.createElement("div");
    if (userType === "sender") {
        div.className = "message outgoing";
    } else {
        div.className = "message incoming";
    }
    const h3 = document.createElement("h3");
    const span = document.createElement("span");
    const p = document.createElement("p");
    span.innerText = time;
    span.className = "time";
    h3.append(document.createTextNode(username));
    p.append(document.createTextNode(msg));
    div.appendChild(h3);
    div.appendChild(span);
    div.appendChild(p);
    msgBox.appendChild(div);
}

// OTriggering the ffline Mode
disconnectBtn.onclick = () => {
    socket.emit("leave-room");
    setInterval(() => {
        socket.disconnect();
        window.location = "http://localhost:3000";
    }, 1500);
};