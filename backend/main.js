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

io.on('connection', function (socket) {
  var socketId = socket.id;
  var address = socket.request.connection.remoteAddress;
  socket.nickname = 'guest';
  console.log('('+socketId+') ' + socket.nickname + ' connected from ' + address);
  io.emit('broadcast join', socket.nickname);

  socket.on('disconnect', function () {
    console.log('('+socketId+') ' + socket.nickname +' disconnected');
    io.emit('broadcast leave', socket.nickname);
  });

  //receive and broadcast message
  socket.on('send message', function(msg) {
    console.log('('+socketId+') ' + socket.nickname + ' said: '+msg);
    io.emit('broadcast message', socket.nickname, msg);
  });

  socket.on('send rename', function(msg) {
    var oldName = socket.nickname;
    var newName = msg.substring(0, c.MAX_NICKNAME_LENGTH);
    console.log('('+socketId+') ' + oldName + ' renamed to ' + newName);
    socket.nickname = newName;
    io.emit('broadcast rename', oldName, newName);
  });

});

server.listen(3000, function () {
  console.log('listening on *.3000');
});
