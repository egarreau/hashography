var socket = io.connect(window.location.host);

var geocoder = new google.maps.Geocoder();

var markers = [];
function makeMarker(coordinateArray, map, tweet){
  var marker = new google.maps.Marker({
    position: { lat: coordinateArray[0], lng: coordinateArray[1] },
    map: map
  });

  markers.push(marker);
  //The following code was written by "Engineer", from StackOverflow. In June 19th 2012,
  //"Engineer" decided to make a post to help people like me use Google Map API to help
  //us display multiple infoboxes. Thank you Engineer!
  var content = tweet;

  var infowindow = new google.maps.InfoWindow();

  google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
          return function() {
             infowindow.setContent(content);
             infowindow.open(map,marker);
          };
      })(marker,content,infowindow));
};


// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

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
    $("#textarea1").focus();
    // socket.emit('reset')
    var mapOptions = {
      center: { lat: 20, lng: 0},
      zoom: 3
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    socket.on('tweet', function(data){
      makeMarker(data.coordinates, map, data.tweet);
    });

    $("#search-form").on('submit', function(event){
      event.preventDefault();
      var searchWord = $('#textarea1').val();
    // clear the map
      clearMarkers();
      socket.emit('newSearch');
      socket.emit('search', { word: searchWord });
    })

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

    socket.on('openModal', function(data){
        $('#modal1').openModal();
    });


})





