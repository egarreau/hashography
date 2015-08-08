var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'ncjKabjKKdcmnKkTyA0irhjIG',
  consumer_secret: '63XT0n4AdCcad3v3g37fHwelbbekHERNFVgC5GJm7HWQJoXvg4',
  access_token_key: '127879897-dSW0TRtfjE0eWYHyf0VHtH6UDNDFRCX1G8afJETN',
  access_token_secret: 'Rej1phiRJzAi62ah6c2hrSPmlTQczzhY2ctwoP1ckmMfh'
});


var streamData = function(searchTerm){
  client.stream('statuses/filter', {track: searchTerm}, function(stream){
    stream.on('data', function(tweet) {
      console.log("Text: " + tweet.text);

      if (tweet.coordinates === null || tweet.coordinates === undefined) {
        if (tweet.place === null){
          // parse tweet.user.location using CSV matching
        }
        else{
          // send tweet.place.bounding_box.coordinates to map
          console.log("Bounding Box Coordinates: " + tweet.place.bounding_box.coordinates);
        };
      }
      else{
        // send tweet.coordinates.coordinates to map
        console.log("Coordinates: " + tweet.coordinates.coordinates);
      };

    });

  });
};

streamData("car");
