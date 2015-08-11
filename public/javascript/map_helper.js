(function() {
  this.geocoder = new google.maps.Geocoder();
  this.markers = [];

  function makeMarker(coordinateArray, map, tweet){
    var marker = new google.maps.Marker({
      position: { lat: coordinateArray[0], lng: coordinateArray[1] },
      map: map,
      animation: google.maps.Animation.DROP,
      icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 4,
          fillOpacity: 0,
          strokeColor: '#00b0ff'
        }
    });
    markers.push(marker);
    setMarkerTweetProperties(tweet, marker, map);
  };
  this.makeMarker = makeMarker;

  function setMarkerTweetProperties(tweet, marker, map){
    //The following code was written by "Engineer" on Stack Overflow on June 19th 2012. http://stackoverflow.com/questions/11106671/google-maps-api-multiple-markers-with-infowindows
  //Hovering feature code was from Stack Overflow. See http://stackoverflow.com/questions/8920738/google-maps-v3-marker-info-window-on-mouseover
    var content = tweet;
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker,'mouseover', (function(marker,content,infowindow){
      return function() {
        infowindow.setContent(content);
        infowindow.open(map,marker);
      };
    })(marker,content,infowindow));

    google.maps.event.addListener(marker, 'mouseout', function(){
      infowindow.close();
    });
  }
  this.setMarkerTweetProperties = setMarkerTweetProperties;

  // Sets the map on all markers in the array.
  function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  this.setAllMap = setAllMap;

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setAllMap(null);
  }
  this.clearMarkers = clearMarkers;

  function geocoding(address, callback) {
    this.geocoder.geocode({"address": address}, function(results, status){
      if (status == google.maps.GeocoderStatus.OK){
        //take first set of coordinates returned.
        var location = results[0].geometry.location
        var lat = location.G
        var lng = location.K
        callback([lat, lng]);
      }
    });
  };
  this.geocoding = geocoding;

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
  // this.exports.initializeMap = initializeMap;
  this.initializeMap = initializeMap;
}).call(this)
