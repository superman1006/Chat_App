const chatForm = document.getElementById('chat-form');
const messageContainer = document.getElementById('messages-container');
const socket = io();

// Output message to DOM
function outputMessage (message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                    <p class="text">${message.text}</p>`;
  messageContainer.appendChild(div);
}

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  // Scroll down to the latest message
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  // Get message text
  let msg = e.target.elements.msg.value;
  msg = msg.trim();
  if (!msg) {
    return false;
  }
  // Emit message to server
  socket.emit('chatMessage', msg);
  // Clear input field
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output room name
function outputRoomName (room) {
  const roomName = document.getElementById('room-name');
  roomName.innerText = room;
}

// Output users
function outputUsers (users) {
  const userList = document.getElementById('users');
  userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
