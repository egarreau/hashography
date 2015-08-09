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


io.on('connection', function(socket){
  socket.on('search', function(data){
    client.stream('statuses/filter', {track: data.word}, function(stream){
      stream.on('data', function(tweet) {
        console.log("Text: " + tweet.text);

        if (tweet.coordinates === null || tweet.coordinates === undefined) {
          if (tweet.place === null){
            socket.emit('geocoder', { location: tweet.user.location });
          }
          else{
            // send tweet.place.bounding_box.coordinates to client
            socket.emit('tweet', {coordinates: tweet.place.bounding_box.coordinates});
          };
        }
        else{
          // send tweet.coordinates.coordinates to client
          socket.emit('tweet', {coordinates: tweet.coordinates.coordinates});
        };
      });
    });
  });
});


var client = new twitter({
  consumer_key: 'ncjKabjKKdcmnKkTyA0irhjIG',
  consumer_secret: '63XT0n4AdCcad3v3g37fHwelbbekHERNFVgC5GJm7HWQJoXvg4',
  access_token_key: '127879897-dSW0TRtfjE0eWYHyf0VHtH6UDNDFRCX1G8afJETN',
  access_token_secret: 'Rej1phiRJzAi62ah6c2hrSPmlTQczzhY2ctwoP1ckmMfh'
});

// var streamData = function(searchTerm){
//   client.stream('statuses/filter', {track: searchTerm}, function(stream){
//     stream.on('data', function(tweet) {
//       console.log("Text: " + tweet.text);
//       if (tweet.coordinates === null || tweet.coordinates === undefined) {
//         if (tweet.place === null){
//           // parse tweet.user.location using CSV matching
//         }
//         else{
//           // send tweet.place.bounding_box.coordinates to map
//           socket.emit('tweet', {coordinates: tweet.place.bounding_box.coordinates});
//         };
//       }
//       else{
//         // send tweet.coordinates.coordinates to map
//         socket.emit('tweet', {coordinates: tweet.coordinates.coordinates});
//       };
//     });
//   });
// };

// streamData("car");
