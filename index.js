var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var twitter = require('twitter');

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
  point1 = box[0]
  point2 = box[1]
  point3 = box[2]
  midX = (point1[1] + point2[1]) / 2
  midY = (point1[0] + point3[0]) / 2
  return [midX, midY]
}

io.on('connection', function(socket){
  socket.on('search', function(data){
    client.stream('statuses/filter', {track: data.word}, function(stream){
      socket.on('disconnect', function(){
        console.log("DESTROYED MWAHAHAHAHHAHHAHAHAHAH")
        stream.destroy()
      })
      stream.on('error', function(error){
        console.log(error)
      })
      stream.on('data', function(tweet) {
        // console.log("###########################")
        // console.dir(tweet)
        // console.log("coordinates: " + tweet.coordinates)
        // console.log("place: " + tweet.place)
        if (tweet.limit === undefined){
          if (tweet.coordinates === null) {
            if (tweet.place === null){
              socket.emit('geocoder', { location: tweet.user.location, tweet: tweet.text });
            }
            else{
              midPoint = findBoxCenter(tweet.place.bounding_box.coordinates[0]);
              socket.emit('tweet', {coordinates: midPoint, tweet: tweet.text });
            };
          }
          else{
            socket.emit('tweet', {coordinates: tweet.coordinates.coordinates, tweet: tweet.text });
          };
        };
      });
    });
  });
});


