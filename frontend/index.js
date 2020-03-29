function scrollToBottom() {
  var scrollElem = $('#chat-display .scroll')[0];
  scrollElem.scrollTop = scrollElem.scrollHeight;
};

function displayMessage(msgType, msgText) {
  $('#chat-display ul').append($('<li class=chat-"'+msgType+'">').text(msgText));
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
    displayMessage('chat-message', msg);
  });
});
