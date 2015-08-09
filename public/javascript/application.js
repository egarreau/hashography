var socket = io.connect('http://localhost:5000');
var geocoder = new google.maps.Geocoder();

function makeMarker(coordinateArray, map){
  var marker = new google.maps.Marker({
    position: { lat: coordinateArray[0], lng: coordinateArray[1] },
    map: map
  })
}


var geocoding = function(address, map) {
    geocoder.geocode({"address": address}, function(results, status){
      if (status == google.maps.GeocoderStatus.OK){
        var location = results[0].geometry.location
        var lat = location.G
        var lng = location.K
        makeMarker([lat, lng], map);
      }
      else {
        console.log("Geocode was not successful for the following reason: "+ status)
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
      makeMarker(data.coordinates, map);
    });

    socket.emit('search', {word: 'cat'})

    socket.on('geocoder', function(data){
      var address = data.location
      if (address === "")
      {
        console.log("Blank string")
      }
      else {
      setTimeout(geocoding(address, map), 500);
      };
    });

})





