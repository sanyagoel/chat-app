const socket = io();

const joinForm = document.getElementById("join-form");
if (joinForm) {
  joinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username-input").value;
    socket.emit("join", { username });
    joinForm.submit(); // Continue to the chatroom
  });
}

const clientsTotal = document.getElementById("clients-total");
const nameInput = document.getElementById("name-input");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const feedbackMsg = document.getElementById("feedback");
const welcomeMsg = document.getElementById("welcome-msg");

if (messageForm) {
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });

  const sendMessage = function () {
    if (messageInput.value === "") return;
    const data = {
      name: nameInput.value,
      message: messageInput.value,
      date: new Date(),
    };
    socket.emit("message", data);
    addMessageToUI(true, data);
    messageInput.value = "";
  };

  socket.on("welcome", (data) => {
    const element = `
                <li class="welcome">
                    <p class="welcome-msg" id="welcome-msg">
                        ${data.username} joined !! <3
                    </p>
                </li>`;
    messageContainer.innerHTML += element;
  });

  socket.on("chat-message", (data) => {
    addMessageToUI(false, data);
  });

  socket.on("clients-total", (data) => {
    clientsTotal.innerText = `Total Clients : ${data}`;
  });

  const addMessageToUI = function (isOwnMessage, data) {
    const formattedDate = moment(data.date)
      .utcOffset("+05:30")
      .format("Do MMMM HH:mm a");
    clearFeedback();
    const element = `
                <li class="${isOwnMessage ? "message-right" : "message-left"}">
                    <p class="message">
                        ${data.message}
                        <span>${data.name} ⚪ ${formattedDate}. </span>
                    </p>
                </li>`;
    messageContainer.innerHTML += element;
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
  };

  messageInput.addEventListener("focus", () => {
    socket.emit("feedback", {
      feedback: `${nameInput.value} is typing a message`,
    });
  });

  messageInput.addEventListener("keypress", () => {
    socket.emit("feedback", {
      feedback: `${nameInput.value} is typing a message`,
    });
  });

  messageInput.addEventListener("blur", () => {
    socket.emit("feedback", {
      feedback: ``,
    });
  });

  socket.on("feedback-server", (data) => {
    clearFeedback();
    const element = `<li class="message-feedback">
                <p class="feedback">
                    ${data.feedback}
                </p>
            </li>`;
    messageContainer.innerHTML += element;
  });

  const clearFeedback = function () {
    document.querySelectorAll("li.message-feedback").forEach((element) => {
      element.parentNode.removeChild(element);
    });
  };
}
