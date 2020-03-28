var express = require('express');
var http = require('http');

app = express();
server = http.createServer(app);

app.get('/', function(req, res) {
  res.send('hello world');
});

server.listen(3000, function() {
  console.log('listening on *.3000')
});
