var socket = io.connect('http://localhost:5000');

function makeMarker(coordinateArray, map){
  var marker = new google.maps.Marker({
    position: { lat: coordinateArray[0], lng: coordinateArray[1] },
    map: map
  })
}

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

})





