var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var twitter = require('twitter');
var request = require('request');


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

// function doomsday(oembed_url) {
//   console.log("Greetings streamers!")
//   console.log(oembed_url)
//   request(oembed_url, function(error, response, body){
//     if (error)
//     {
//       console.log(error)
//     }
//     else if(response.code == 200) {
//       console.log(response)
//     }
//     else {
//       console.log(response.statusCode)
//     }
//   });
// }
  // console.log(https)
  // https.request("https://google.com", function(response){
  //   console.log(response)
    // console.log("Status:"+ response.statusCode);
    // console.log("Headers:"+JSON.stringify(response.headers));
    // response.on("data", function(chunk){
    //   console.log("Body: "+chunk);

var OEMBED_LINK = "https://api.twitter.com/1.1/statuses/oembed.json"

io.on('connection', function(socket){
  socket.on('search', function(data){
    client.stream('statuses/filter', {track: data.word}, function(stream){
      socket.on('disconnect', function(){
        console.log("DESTROYED MWAHAHAHAHHAHHAHAHAHAH")
        stream.destroy()
      })
      stream.on('error', function(error){
        socket.emit('openModal');
        console.log(error);
      })
      stream.on('data', function(tweet) {
        // var oembed_url = "https://api.twitter.com/1.1/statuses/oembed.json?id="+tweet.id_str
        // doomsday(oembed_url)
        // console.log("###########################")
        // console.log("coordinates: " + tweet.coordinates)
        // console.log("place: " + tweet.place)
        var twitter_code = '<blockquote class="twitter-tweet" data-cards="hidden" lang="en"><p lang="en" dir="ltr">'+tweet.text+'</p>&mdash;'+tweet.user.name+'(@'+tweet.user.screen_name+')</blockquote>'
        if (tweet.limit === undefined){
          if (tweet.coordinates === null) {
            if (tweet.place === null){
              socket.emit('geocoder', { location: tweet.user.location, tweet: twitter_code });
            }
            else{
              midPoint = findBoxCenter(tweet.place.bounding_box.coordinates[0]);
              socket.emit('tweet', {coordinates: midPoint, tweet: twitter_code });
            };
          }
          else{
            socket.emit('tweet', {coordinates: tweet.coordinates.coordinates, tweet: twitter_code });
          };
        };
      });
    });
  });
});


