var geocoder = new google.maps.Geocoder();
var markers = [];

function makeMarker(coordinateArray, map, tweet, color){
  var marker = new google.maps.Marker({
    position: { lat: coordinateArray[0], lng: coordinateArray[1] },
    map: map,
    animation: google.maps.Animation.DROP,
    icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4,
        fillOpacity: 0,
        strokeColor: color
      }
  });
  markers.push(marker);
  setMarkerTweetProperties(tweet, marker, map);
};

function prepareTweetContent(marker, content, infowindow, map){
  return function() {
    infowindow.setContent(content);
    infowindow.open(map,marker);
  };
}

function setMarkerTweetProperties(tweet, marker, map){
  var content = tweet;
  var infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'mouseover', prepareTweetContent(marker,content,infowindow, map));
  google.maps.event.addListener(marker, 'mouseout', function(){
    infowindow.close();
  });
}

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

function geocoding(address, map, tweet, color) {
  geocoder.geocode({"address": address}, function(results, status){
    if (status == google.maps.GeocoderStatus.OK){
      //take first set of coordinates returned.
      var location = results[0].geometry.location
      var lat = location.G
      var lng = location.K
      makeMarker([lat, lng], map, tweet, color);
    }
    else {
      // console.log("Geocode was not successful for the following reason: "+ status)
    }
  })
};

function initializeMap(){
  var mapOptions = {
      center: { lat: 20, lng: 0},
      zoom: 3
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  map.setOptions({styles: styles});
  return map; //to make map available for use in application.
}
