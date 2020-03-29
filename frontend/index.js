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
  socket.emit('send '+msgType, msgText);
};

$(function() {
  var socket = io();

  //submit chat message
  $('#chat-input').submit(function(e) {

    //prevent page reload;
    e.preventDefault(); //prevent page reload;

    var message = $('#chat-input input').val();
    var commandMatch = /^\/([a-z]+) (.*)/g.exec(message)
    if (commandMatch) {
      operator = commandMatch[1];
      operand = commandMatch[2];
      if (operator = 'nick') {
        sendMessage(socket, 'rename', operand);
      }
    } else {
      sendMessage(socket, 'message', message);
    }

    //clear message field
    $('#chat-input input').val('');

    return false;
  });

  socket.on('broadcast message', function(nick, msg) {
    displayMessage('message', nick, msg);
  });

  socket.on('broadcast join', function(nick) {
    displayMessage('join', nick, 'connected');
  });

  socket.on('broadcast leave', function(nick) {
    displayMessage('leave', nick, 'disconnected');
  });

  socket.on('broadcast rename', function(oldName, newName) {
    displayMessage('rename', oldName, 'renamed to ' + newName);
  });
});
