const MAX_NICKNAME_LENGTH = 20;
const MAX_CHANNELNAME_LENGTH = 20;

(function(){

  this.filterNickname = function(nick) {
    return nick.substring(0, MAX_NICKNAME_LENGTH);
  };
  this.getDefaultChannel = function() {
    return 'lobby';
  }
  this.filterChannelName = function(channel) {
    return channel.substring(0, MAX_CHANNELNAME_LENGTH)
  }

}).call(this);
