const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const activeChats = {};

// API to pair users
app.post('/pair-users', (req, res) => {
  const { user1, user2 } = req.body;
  const chatId = uuidv4();
  activeChats[chatId] = {
    users: [user1, user2],
    messages: [],
    startTime: Date.now(),
  };
  res.json({ chatId, users: [user1, user2] });
});

// API to send messages
app.post('/send-message', (req, res) => {
  const { chatId, sender, message } = req.body;
  if (activeChats[chatId]) {
    activeChats[chatId].messages.push({ sender, message, timestamp: Date.now() });
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Chat not found' });
  }
});

// Automatically delete chats after 1 hour
setInterval(() => {
  const now = Date.now();
  for (const chatId in activeChats) {
    if (now - activeChats[chatId].startTime > 3600000) {
      delete activeChats[chatId];
    }
  }
}, 60000);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
