const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// 获取聊天表单和消息框元素
const chatForm = document.getElementById('chat-form');
const messageBox = document.getElementById('message-box');

// 监听聊天表单的提交事件
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // 获取用户输入的消息
  const msg = e.target.elements.msg.value;

  // 在消息框中添加新的消息
  const message = document.createElement('div');
  message.classList.add('message');
  message.innerHTML = `
    <p class="meta">You <span>${new Date().toLocaleTimeString()}</span></p>
    <p class="text">${msg}</p>
  `;
  messageBox.appendChild(message);

  // 将消息发送给服务器
  socket.emit('chatMessage', msg);

  // 清空消息输入框
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
