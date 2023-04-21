/*
 * @Author: superman1006 1402788264@qq.com
 * @Date: 2023-04-18 22:15:14
 * @LastEditors: superman1006 1402788264@qq.com
 * @LastEditTime: 2023-04-21 19:19:58
 * @FilePath: \chat\chat-app\server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// 维护在线用户列表
const onlineUsers = new Map();

// Serve static files
app.use(express.static(__dirname + '/public'));

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('a user connected');

  // Send a welcome message to the new user
  socket.emit('chat message', 'you are connected');

  // Broadcast a message to all other connected clients
  socket.broadcast.emit('chat message', 'a user connected');

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });

  // Handle user left
  socket.on('user left', (reason) => {
    console.log('user left', reason);
    // Send a welcome message to the new user
    socket.emit('chat message', 'you have disconnected');
    // Broadcast a message to all other connected clients
    socket.broadcast.emit('chat message', 'a user has disconnected');
  });


  // Handle user left
  socket.on('disconnect', (reason) => {
    console.log('user left', reason);
    // 当有用户断开连接时将其从在线用户列表中移除
    onlineUsers.delete(socket.id);
    // Broadcast a message to all other connected clients
    socket.broadcast.emit('chat message', 'a user has disconnected');
  });

  // 当有新用户连接时将其加入在线用户列表
  onlineUsers.set(socket.id, { id: socket.id });

  // 处理获取在线用户列表的请求
  socket.on('get user list', () => {
    const userList = Array.from(onlineUsers.values());
    socket.emit('user list', userList);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
