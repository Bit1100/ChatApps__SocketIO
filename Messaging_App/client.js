// Creating socket
const socket = io("http://localhost:5000");
const msgContainer = document.querySelector(".message-container");
const form = document.querySelector("#form");
const msgBox = document.querySelector(".message-box");
const connectBtn = document.querySelector(".connect-btn");
const disconnectBtn = document.querySelector(".disconnect-btn");
const msgFormInput = form.querySelector('[type="text"]');

let name;

// Won't exit prompt until you entered you name
do {
    name = prompt("Enter your name:");
} while (!name);

// New User Joining Event Fired
if (name) {
    socket.emit("new-user", name.trim());
    displayMessage(name, "You joined", "sender");
}

// Registering the user connection event
socket.on("user-connected", (data) => {
    const { username, message } = data;
    displayMessage(username, message);
});

// Registering the receive chat message event
socket.on("receive-chat-message", (data) => {
    const { username, message } = data;
    displayMessage(username, message);
    scrollToButton();
});

// Registering the user disconnection event
socket.on("leftoff", (data) => {
    const { username, message } = data;
    displayMessage(username, message);
    scrollToButton();
});

// Registering the user Re-connection event
socket.on("reconnected", (data) => {
    const { username, message } = data;
    displayMessage(username, message);
    scrollToButton();
});

// Submitting the form
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = msgFormInput.value;
    if (msg === "") return;
    if (socket.connected) {
        socket.emit("send-chat-message", name, msg.trim());
        displayMessage(name, msg, "sender");
        msgFormInput.value = "";
        scrollToButton();
    }
});

// Showing incoming/outgoing message
function displayMessage(username, msg, userType = "") {
    const div = document.createElement("div");
    if (userType === "sender") {
        div.className = "message outgoing";
    } else {
        div.className = "message incoming";
    }
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    h3.append(document.createTextNode(username));
    p.append(document.createTextNode(msg));
    div.appendChild(h3);
    div.appendChild(p);
    msgBox.appendChild(div);
}

// Triggering the Online Mode
connectBtn.onclick = () => {
    socket.emit("connection-on", name);
    displayMessage(name, "You Re-joined the session", "sender");
    socket.connect();
};
// OTriggering the ffline Mode
disconnectBtn.onclick = () => {
    socket.emit("connection-off", name);
    displayMessage(name, "You Leftoff the session", "sender");
    socket.disconnect();
};

// Scroll to bottom
function scrollToButton() {
    msgBox.scrollTop = msgBox.scrollHeight;
}