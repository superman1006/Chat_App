const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const status = document.getElementById('status');

// 建立连接
const socket = io();

// 监听连接成功事件
socket.on('connect', () => {
  status.innerText = 'Connected';
});

// 监听新用户加入聊天室事件
socket.on('user joined', (username) => {
  const message = `${username} has joined the chat`;
  const li = document.createElement('li');
  li.classList.add('system');
  li.innerText = message;
  chatMessages.appendChild(li);
});

// 监听用户发送消息事件
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = chatInput.value;
  socket.emit('chat message', message);
  chatInput.value = '';
});

// 监听用户收到新消息事件
socket.on('chat message', (data) => {
  const { username, message } = data;
  const li = document.createElement('li');
  li.innerText = `${username}: ${message}`;
  chatMessages.appendChild(li);
});

// 监听用户离开聊天室事件
socket.on('user left', (username) => {
  const message = `${username} has left the chat`;
  const li = document.createElement('li');
  li.classList.add('system');
  li.innerText = message;
  chatMessages.appendChild(li);
});


//将 Express 和 Socket.IO 模块加载到你的项目中，并将其应用于 Express 应用程序
const express = require('express');
const app = express();
const http = require('http').createServer(app); // 使用 createServer 方法创建一个 http 服务器
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (data) => {
    const { username, message } = data;
    console.log('message: ' + message);
    io.emit('chat message', { username, message });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});