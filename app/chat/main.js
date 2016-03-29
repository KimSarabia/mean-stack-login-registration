// generate a random username
var randomName = function() {

  var animals = ['pigeon', 'seagull', 'bat', 'owl', 'sparrows', 'robin', 'bluebird', 'cardinal', 'hawk', 'fish', 'shrimp', 'frog', 'whale', 'shark', 'eel', 'seal', 'lobster', 'octopus', 'mole', 'shrew', 'rabbit', 'chipmunk', 'armadillo', 'dog', 'cat', 'lynx', 'mouse', 'lion', 'moose', 'horse', 'deer', 'raccoon', 'zebra', 'goat', 'cow', 'pig', 'tiger', 'wolf', 'pony', 'antelope', 'buffalo', 'camel', 'donkey', 'elk', 'fox', 'monkey', 'gazelle', 'impala', 'jaguar', 'leopard', 'lemur', 'yak', 'elephant', 'giraffe', 'hippopotamus', 'rhinoceros', 'grizzlybear']

  var colors = ['silver', 'gray', 'black', 'red', 'maroon', 'olive', 'lime', 'green', 'teal', 'blue', 'navy', 'fuchsia', 'purple'];

  return colors[Math.floor(Math.random() * colors.length)] + '_' + animals[Math.floor(Math.random() * animals.length)];

}

var me = randomName();
$('#whoami').text(me);

var $input = $('#chat-input');
var $output = $('#chat-output');

var pubnub = PUBNUB.init({
  publish_key: 'demo',
  subscribe_key: 'demo',
  uuid: me
});

var channel = 'memewarz-lobby-demo-5';

$('#chat').submit(function() {

  pubnub.publish({
    channel: channel,
    message: {
      text: $input.val(),
      username: me
    }
  });

  $input.val('');

  return false;

});

pubnub.subscribe({
  channel: channel,
  message: function(data) {

    var $line = $('<li class="list-group-item"><strong>' + data.username + ':</strong> </span>');
    var $message = $('<span class="text" />').text(data.text).html();

    $line.append($message);
    $output.append($line);

    $output.scrollTop($output[0].scrollHeight);

  },
  presence: function(data) {

    console.log(data);

    // get notified when people join
    if(data.action == "join") {

      var $new_user = $('<li id="' + data.uuid + '" class="list-group-item">' + data.uuid + '</li>')

      $('#online-users').append($new_user);

    }

    // and when they leave
    if(data.action == "leave"  || data.action == "timeout") {
      $('#' + data.uuid).remove();
    }

  }
});
