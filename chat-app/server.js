/*
 * @Author: superman1006 1402788264@qq.com
 * @Date: 2023-04-18 22:15:14
 * @LastEditors: superman1006 1402788264@qq.com
 * @LastEditTime: 2023-04-21 12:57:31
 * @FilePath: \chat\chat-app\server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

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

  // Handle disconnections
  socket.on('user left', (reason) => {
    console.log('user left', reason);

    // get the rooms of the socket
    const rooms = Object.keys(socket.rooms);

    // emit "you have disconnected" to the current socket only
    socket.emit('chat message', 'you have disconnected');

    // emit "a user has disconnected" to all other sockets in the room
    rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit('chat message', 'a user has disconnected');
      }
    });
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
