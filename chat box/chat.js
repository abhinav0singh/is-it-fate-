const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const timerDisplay = document.getElementById('timer');
const modeToggle = document.getElementById('modeToggle');
const userGreeting = document.getElementById('userGreeting');
const activeUserName = document.getElementById('activeUserName');
const flowerAnimation = document.getElementById('flowerAnimation');

let countdown = 60; // 1 minute in seconds

// User Data
const maleUser = { name: "Abhinav", interest: "I like traveling" };
const femaleUser = { name: "Anshika", interest: "I like to paint" };

// Load User Data
const activeUser = maleUser; // Change to femaleUser to simulate
userGreeting.innerHTML = `Say Hi to ${activeUser.name}, their interests are "${activeUser.interest}".`;
activeUserName.innerText = activeUser.name; // Display user's name in header

// Timer Logic
function updateTimer() {
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')} remaining`;

  if (countdown <= 0) {
    clearInterval(timerInterval);
    endChat();
  }

  countdown--;
}

const timerInterval = setInterval(updateTimer, 1000);

// End Chat Animation
function endChat() {
  flowerAnimation.classList.remove('hidden');
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 3000);
}

// Toggle Dark Mode
modeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});

// Send Message
sendMessageBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    appendMessage(message, 'sent');
    messageInput.value = '';
  }
});

function appendMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.innerText = message;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function redirectToDashboard() {
  window.location.href = 'dashboard.html';
}

const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get("room");

// Example WebSocket connection
const socket = new WebSocket(`ws://your-server-address/chat/${room}`);

socket.onmessage = (event) => {
  const chatContainer = document.getElementById("chatContainer");
  const message = document.createElement("div");
  message.textContent = event.data;
  chatContainer.appendChild(message);
};

document.getElementById("sendButton").addEventListener("click", () => {
  const messageInput = document.getElementById("messageInput");
  socket.send(messageInput.value);
  messageInput.value = "";
});