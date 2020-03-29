function scrollToBottom() {
  var scrollElem = $('#chat-display .scroll')[0];
  scrollElem.scrollTop = scrollElem.scrollHeight;
};

function displayMessage(msgType, msgText) {
  var timestamp = (new Date).toLocaleTimeString('fi-FI');
  var newEntry = $('#chat-display ul').append($('<li>'));
  newEntry.append($('<span class=chat-timestamp>'+timestamp+'</span>'));
  newEntry.append($('<span class=chat-'+msgType+'></span>').text(msgText));
  scrollToBottom();
};

function sendMessage(socket, msgType, msgText) {
  socket.emit('send '+msgType, $('#chat-input input').val());
};

$(function() {
  var socket = io();

  //submit chat message
  $('#chat-input').submit(function(e) {

    //prevent page reload;
    e.preventDefault(); //prevent page reload;

    sendMessage(socket, 'message', $('#chat-input input'));

    //clear message field
    $('#chat-input input').val('');

    return false;
  });

  socket.on('broadcast message', function(msg) {
    displayMessage('message', msg);
  });

  socket.on('broadcast join', function(msg) {
    displayMessage('join', 'user connected');
  });

  socket.on('broadcast leave', function(msg) {
    displayMessage('leave', 'user disconnected');
  });
});
