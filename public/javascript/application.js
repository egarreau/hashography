var socket = io.connect('http://localhost:5000');
var geocoder = new google.maps.Geocoder();

function makeMarker(coordinateArray, map, tweet){
  var marker = new google.maps.Marker({
    position: { lat: coordinateArray[0], lng: coordinateArray[1] },
    map: map
  })

  var content = tweet;

  var infowindow = new google.maps.InfoWindow()

  google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
          return function() {
             infowindow.setContent(content);
             infowindow.open(map,marker);
          };
      })(marker,content,infowindow));
};


var geocoding = function(address, map, tweet) {
    geocoder.geocode({"address": address}, function(results, status){
      if (status == google.maps.GeocoderStatus.OK){
        var location = results[0].geometry.location
        var lat = location.G
        var lng = location.K
        makeMarker([lat, lng], map, tweet);
      }
      else {
        // console.log("Geocode was not successful for the following reason: "+ status)
      }
    })
  };



$(document).ready(function(){

    var mapOptions = {
      center: { lat: 20, lng: 85},
      zoom: 6
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    socket.on('tweet', function(data){
      makeMarker(data.coordinates, map, data.tweet);
    });

    socket.emit('search', {word: 'cat'})

    socket.on('geocoder', function(data){
      var address = data.location
      if (address === "")
      {
        // console.log("Blank string")
      }
      else {
      setTimeout(geocoding(address, map, data.tweet), 500);
      };
    });

})





