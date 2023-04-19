// 获取导航栏中的三个单词
const home = document.querySelector('.navbar-nav .nav-item:nth-child(1) .nav-link');
const about = document.querySelector('.navbar-nav .nav-item:nth-child(2) .nav-link');
const chat = document.querySelector('.navbar-nav .nav-item:nth-child(3) .nav-link');

// 获取横条元素
const activeIndicator = document.createElement('div');
activeIndicator.classList.add('active-indicator');

// 将横条添加到导航栏中
// home.parentElement.appendChild(activeIndicator);

// 定义函数，根据当前激活的单词更新横条的位置和颜色
function updateActiveIndicatorPosition () {
  const activeNav = document.querySelector('.navbar-nav .active');
  const activeLink = activeNav.querySelector('.nav-link');
  const activeRect = activeLink.getBoundingClientRect();
  const navRect = activeNav.getBoundingClientRect();

  activeIndicator.style.width = `${activeRect.width}px`;
  activeIndicator.style.transform = `translateX(${activeRect.x - navRect.x}px)`;

  if (activeNav === home.parentElement) {
    activeIndicator.style.backgroundColor = 'orange';
  } else if (activeNav === about.parentElement) {
    activeIndicator.style.backgroundColor = 'blue';
  } else if (activeNav === chat.parentElement) {
    activeIndicator.style.backgroundColor = 'green';
  }
}

// 页面加载时更新横条的位置和颜色
updateActiveIndicatorPosition();

// 当用户鼠标移动到单词时，更新横条的位置和颜色
home.addEventListener('mouseover', () => {
  activeIndicator.classList.remove('active-about', 'active-chat');
  activeIndicator.classList.add('active-home');
  updateActiveIndicatorPosition();
});

about.addEventListener('mouseover', () => {
  activeIndicator.classList.remove('active-home', 'active-chat');
  activeIndicator.classList.add('active-about');
  updateActiveIndicatorPosition();
});

chat.addEventListener('mouseover', () => {
  activeIndicator.classList.remove('active-home', 'active-about');
  activeIndicator.classList.add('active-chat');
  updateActiveIndicatorPosition();
});


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