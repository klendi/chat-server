'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
var users = [];
var PORT = process.env.PORT || 5000;

io.on('connection', function (socket) {
  socket.on('message', function (data) {
    io.emit('newMessage', data);
  });

  socket.on('join', function (data) {
    console.log('got a data', data);
    socket.user = data;
    users.push(socket.user);
    io.emit('userJoined', data);
  });

  socket.on('disconnect', function (data) {
    if (!socket.user) return;
    users.splice(users.indexOf(socket.user), 1);
    console.log('someone left', data);
    io.emit('userDisconnected', data);
  });

  var updateUsernames = function updateUsernames() {
    socket.emit('getOnlineUsers');
  };
});

var server = http.listen(PORT, function () {
  console.log('Server is running at port ', PORT);
});