var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var twitter = require('twitter');
var sediment = require('sediment');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


app.get('/', function(request, response) {
  response.render('pages/index');
});


var client = new twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


function findBoxCenter(box){
  point1 = box[0];
  point2 = box[1];
  point3 = box[2];
  midX = (point1[1] + point2[1]) / 2;
  midY = (point1[0] + point3[0]) / 2;
  return [midX, midY];
}

function colorizeBlueAttitude(attitude){
  switch(true) {
    case (attitude >= 0.5):
      return '#62ceff'; //light blue
    case (attitude <= -0.5):
      return '#007ab1'; //dark blue
    default:
      return '#00a2eb'; //normal blue
  }
}

function colorizeRedAttitude(attitude){
  switch(true) {
    case(attitude >= 0.5):
      return '#8B0000'; //light red
    case(attitude <= -0.5):
      return '#DB7093'; //dark red
    default:
      return '#FF0000'; //normal red
  }
}

function sendTweets(socket, tweet, color){
  if (tweet.coordinates === null) {
    if (tweet.place === null){
      socket.emit('geocoder', { location: tweet.user.location, tweet: tweet.text, color: color, user: tweet.user.screen_name, id: tweet.id_str });
    }
    else{
      midPoint = findBoxCenter(tweet.place.bounding_box.coordinates[0]);
      socket.emit('tweet', {coordinates: midPoint, tweet: tweet.text, color: color, user: tweet.user.screen_name, id: tweet.id_str });
    }
  }
  else{
    socket.emit('tweet', {coordinates: tweet.coordinates.coordinates, tweet: tweet.text, color: color, user: tweet.user.screen_name, id: tweet.id_str });
  }
}

function load_disconnect_function(socket, stream){
  socket.on('disconnect', function(){
    console.log("DESTROYED MWAHAHAHAHHAHHAHAHAHAH");
    stream.destroy();
  });
}

function load_search_function(socket){
  socket.on('search', function(data){
    var receivedTweets = false;
    var words = data.word.split(",");
    client.stream('statuses/filter', {track: data.word}, function(stream){

      load_disconnect_function(socket, stream);

      socket.on('newSearch', function(){
        console.log("stream is closin...");
        // socket.emit('hideToast');
        stream.destroy();
      });

      stream.on('error', function(error){
        console.log(error);
        if(error instanceof TypeError) {
          console.error("SWALLOWING THE FOLLOWING ERROR! YOLO.");
          console.trace(error);
        } else {
          console.log(error);
          socket.emit('openModal');
        }
      });

      stream.on('data', function(tweet) {
        if (receivedTweets === false) {
          socket.emit('hideToast');
          receivedTweets = true;
        };
        var attitude = (sediment.analyze(tweet.text).score);
        if (words.length === 1) {
          var color = colorizeBlueAttitude(attitude);
          sendTweets(socket, tweet, color);
        }
        else
        {
          var firstWord = new RegExp(words[0],"i");
          var secondWord = new RegExp(words[1], "i");
          if (tweet.text.match(firstWord)){
            var color = colorizeBlueAttitude(attitude);
            sendTweets(socket, tweet, color);
          }
          else if (tweet.text.match(secondWord)) {
            var color = colorizeRedAttitude(attitude);
            sendTweets(socket, tweet, color);
          }
          else
          {
          }
        }
      });

    });
  });
}

io.on('connection', function(socket){
  load_search_function(socket)
});
