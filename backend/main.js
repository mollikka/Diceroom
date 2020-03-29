var express = require('express');

var http = require('http');

var socketio = require('socket.io');

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
  console.log('('+socketId+') user connected from ' + address);

  socket.on('disconnect', function () {
    console.log('('+socketId+') user disconnected');
  });

  //receive and broadcast message
  socket.on('send message', function(msg) {
    console.log('('+socketId+') user said: '+msg);
    io.emit('broadcast message', msg);
  });

});

server.listen(3000, function () {
  console.log('listening on *.3000');
});
