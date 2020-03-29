$(function() {
  var socket = io();

  //submit chat message
  $('#chat-input').submit(function(e) {

    //prevent page reload;
    e.preventDefault(); //prevent page reload;

    //send the message through the socket
    socket.emit('send message', $('#chat-input input').val());

    //clear message field
    $('#chat-input input').val('');

    return false;
  });

  socket.on('broadcast message', function(msg) {
    $('#chat-display ul').append($('<li>').text(msg));
    var scrollElem = $('#chat-display .scroll')[0];
    scrollElem.scrollTop = scrollElem.scrollHeight;
  });
});
