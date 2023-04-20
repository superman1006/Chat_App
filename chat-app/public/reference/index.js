
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
const socket = io();

$('form').submit((e) => {
  e.preventDefault(); // 阻止表单提交

  socket.emit('chat message', $('#m').val());
  $('#m').val('');
});

socket.on('chat message', (msg) => {
  $('#messages').append($('<li>').text(msg));
});
