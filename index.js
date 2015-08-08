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

var clint = new Twitter({
  consumer_key: 'ncjKabjKKdcmnKkTyA0irhjIG',
  consumer_secret: '63XT0n4AdCcad3v3g37fHwelbbekHERNFVgC5GJm7HWQJoXvg4',
  access_token_key: '',
  access_token_secret: ''
});

