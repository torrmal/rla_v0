
Stats = new Meteor.Collection("stats");

DeviceStats = new Meteor.Collection("device_stats");

video_stream = new Meteor.Stream('video_stream');

chatStream = new Meteor.Stream('chat');

if(Meteor.isClient) {
  sendChat = function(message) {
    chatStream.emit('message', message);
    console.log('me: ' + message);
  };

  chatStream.on('message', function(message) {
    console.log('user: ' + message);
  });
}