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
  consumer_key: 'ncjKabjKKdcmnKkTyA0irhjIG',
  consumer_secret: '63XT0n4AdCcad3v3g37fHwelbbekHERNFVgC5GJm7HWQJoXvg4',
  access_token_key: '127879897-dSW0TRtfjE0eWYHyf0VHtH6UDNDFRCX1G8afJETN',
  access_token_secret: 'Rej1phiRJzAi62ah6c2hrSPmlTQczzhY2ctwoP1ckmMfh'
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
      stream.on('data', function(tweet) {

        if (tweet.coordinates === null || tweet.coordinates === undefined) {
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
      });
    });
  });
});


