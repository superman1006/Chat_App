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
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
http.listen(3000, () => {
  console.log('listening on *:3000');
});