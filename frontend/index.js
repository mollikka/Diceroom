function scrollToBottom() {
  var scrollElem = $('#chat-display .scroll')[0];
  scrollElem.scrollTop = scrollElem.scrollHeight;
};

function displayMessage(msgType, nick, msgText) {
  var timestamp = (new Date).toLocaleTimeString('fi-FI');
  var newEntry = $('#chat-display ul').append($('<li>'));
  newEntry.append($('<span class=chat-timestamp>'+timestamp+'</span>'));
  newEntry.append($('<span class=chat-nickname>'+nick+'</span>'));
  newEntry.append($('<span class=chat-'+msgType+'></span>').text(' '+msgText));
  scrollToBottom();
};

function sendMessage(socket, msgType, msgText) {
  console.log(msgType + ': ' + msgText);
  socket.emit('send '+msgType, msgText);
};

$(function() {
  var socket = io();
  socket.nickname = 'guest';
  socket.channel = DEFAULT_CHANNEL;
  displayMessage('connect', 'you', 'connected');

  //submit chat message
  $('#chat-input').submit(function(e) {

    //prevent page reload;
    e.preventDefault();

    //deny message entry if not connected
    if (! socket.connected ) {
      return;
    }

    var message = $('#chat-input input').val();
    //catch commands in the format /operator operand
    var commandMatch = /^\/([a-z]+) (.*)/g.exec(message)
    if (commandMatch) {
      operator = commandMatch[1];
      operand = commandMatch[2];
    } else {
      //catch commands in the format /operator
      commandMatch = /^\/([a-z]+)/g.exec(message)
      if (commandMatch) {
        operator = commandMatch[1];
        operand = '';
      }
    }

    if (commandMatch) {
      if (operator == 'nick') {
        socket.nickname = operand;
        sendMessage(socket, 'rename', operand);
        displayMessage('rename', 'you', 'renamed yourself to ' + operand);
      } else if (operator == 'join') {
        socket.channel = operand;
        sendMessage(socket, 'join', operand);
        displayMessage('join', 'you', 'moved to ' + operand);
      } else if (operator == 'leave') {
        socket.channel = DEFAULT_CHANNEL;
        sendMessage(socket, 'join', DEFAULT_CHANNEL);
        displayMessage('join', 'you', 'moved to ' + DEFAULT_CHANNEL);
      }
    } else {
      sendMessage(socket, 'message', message);
      displayMessage('message', socket.nickname, message);
    }

    //clear message field
    $('#chat-input input').val('');

    return false;
  });

  socket.on('disconnect', function(reason) {
    displayMessage('connect', 'you', 'disconnected');
  });

  socket.on('reconnecting', function(attemptNumber) {
    displayMessage('connect', 'you', 'are trying to reconnect ('+attemptNumber+')');
  });

  socket.on('reconnect', function(attemptNumber) {
    displayMessage('connect', 'you', 'reconnected after '+attemptNumber+ ' retries');
    sendMessage(socket, 'rename', socket.nickname);
    sendMessage(socket, 'join', socket.channel);
  });

  socket.on('broadcast message', function(nick, msg) {
    displayMessage('message', nick, msg);
  });

  socket.on('broadcast join', function(nick, channel) {
    displayMessage('join', nick, 'joined ' + channel);
  });

  socket.on('broadcast leave', function(nick, channel) {
    displayMessage('leave', nick, 'left ' + channel);
  });

  socket.on('broadcast rename', function(oldName, newName) {
    displayMessage('rename', oldName, 'renamed to ' + newName);
  });
});
