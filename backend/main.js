var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var c = require('./chatconstants');

app = express();
server = http.createServer(app);
io = socketio(server);

app.use(express.static('build/frontend'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

function strSocket(socket) {
  return '('+socket.id+') ' + socket.channel + '/' + socket.nickname;
}

function leaveChannel(socket, channelName) {
  console.log(strSocket(socket) + ' left channel '+channelName);
  if (socket.channel == channelName) {
    socket.channel = '';
  }
  socket.leave(channelName, function() {
    socket.to(channelName).emit('broadcast leave', socket.nickname, channelName);
  });
}

function joinChannel(socket, channelname) {
  var newRoom = channelname.substring(0, c.MAX_CHANNELNAME_LENGTH);
  socket.channel = newRoom;
  console.log(strSocket(socket) + ' joined channel '+channelname);
  socket.join(newRoom, function() {
    socket.to(newRoom).emit('broadcast join', socket.nickname, newRoom);
  });
}

io.on('connection', function (socket) {
  var socketId = socket.id;
  var address = socket.request.connection.remoteAddress;

  socket.nickname = 'guest';

  console.log(strSocket(socket) + ' connected from ' + address);
  joinChannel(socket, c.DEFAULT_CHANNEL);

  socket.on('disconnect', function () {
    console.log(strSocket(socket) + ' disconnected');
    socket.to(socket.channel).emit('broadcast leave', socket.nickname, socket.channel);
  });

  //receive and broadcast message
  socket.on('send message', function(msg) {
    console.log(strSocket(socket) + ' said: '+msg);
    socket.to(socket.channel).emit('broadcast message', socket.nickname, msg);
  });

  socket.on('send rename', function(msg) {
    var oldName = socket.nickname;
    var newName = msg.substring(0, c.MAX_NICKNAME_LENGTH);
    console.log(strSocket(socket) + ' renamed to ' + newName);
    socket.nickname = newName;
    socket.to(socket.channel).emit('broadcast rename', oldName, newName);
  });

  socket.on('send join', function(msg) {
    var oldRoom = socket.channel;
    var newRoom = msg.substring(0, c.MAX_CHANNELNAME_LENGTH);
    if (oldRoom != newRoom) {
      leaveChannel(socket, oldRoom);
      joinChannel(socket, newRoom);
    }
  });

});

server.listen(3000, function () {
  console.log('listening on *.3000');
});
