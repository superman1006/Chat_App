const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Serve static files
app.use(express.static(__dirname + '/public'));

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('a user connected');

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
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
