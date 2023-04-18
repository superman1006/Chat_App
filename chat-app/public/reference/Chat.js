/*
 * @Author: superman1006 1402788264@qq.com
 * @Date: 2023-04-18 19:49:07
 * @LastEditors: superman1006 1402788264@qq.com
 * @LastEditTime: 2023-04-18 19:49:18
 * @FilePath: \Vue_PROJECT\JavaScript\Web1\reference\Chat.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

