const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  // 监听新用户加入聊天室事件
  socket.on('user joined', (username) => {
    socket.broadcast.emit('user joined', username);
  });

  // 监听用户发送消息事件
  socket.on('chat message', (message) => {
    const username = socket.handshake.query.username;
    io.emit('chat message', { username, message });
  });

  // 监听用户离开聊天室事件
  socket.on('disconnect', () => {
    console.log('user disconnected');
    const username = socket.handshake.query.username;
    socket.broadcast.emit('user left', username);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

app.get('/stylesheets/style.css', function (req, res) {
  res.type('text/css');
  res.sendFile(__dirname + '/public/stylesheets/style.css');
});
