(function() {
  this.geocoder = new google.maps.Geocoder();
  this.markers = [];

  function makeMarker(coordinateArray, map, tweet, color, user, id){
    var marker = new google.maps.Marker({
      position: { lat: coordinateArray[0], lng: coordinateArray[1] },
      map: map,
      animation: google.maps.Animation.DROP,
      url: "https://twitter.com/" + user + "/status/" + id,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4,
        fillOpacity: 0,
        strokeColor: color,
        strokeWeight: 2
      }
    });
    markers.push(marker);
    setMarkerTweetProperties(tweet, marker, map);
    clickThroughToTweet(marker);
  };
  this.makeMarker = makeMarker;


  function prepareTweetContent(marker, content, infowindow, map){
    return function() {
      infowindow.setContent(content);
      infowindow.open(map,marker);
    };
  }
  this.prepareTweetContent = prepareTweetContent;

  function clickThroughToTweet(marker){
    google.maps.event.addListener(marker, 'click', function() {
        // window.location.href = marker.url;
        window.open(marker.url,'_blank');
    });
  }
  this.clickThroughToTweet = clickThroughToTweet;

  function setMarkerTweetProperties(tweet, marker, map){
    var content = tweet;
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'mouseover', prepareTweetContent(marker,content,infowindow, map));
    google.maps.event.addListener(marker, 'mouseout', function(){
      infowindow.close();
    });
  }

  this.setMarkerTweetProperties = setMarkerTweetProperties;

  // Sets the map on all markers in the array. This is necessary so that we can
  //clear the map later by setting the map for each Marker as null.
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
        var lat = location.lat()
        var lng = location.lng()
        callback([lat, lng]);
      }
    });
  };
  this.geocoding = geocoding;

  function initializeMap(){
    var mapOptions = {
        center: { lat: 20, lng: 0},
        zoom: 3,
        minZoom: 3,
        mapTypeControl: false
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    map.setOptions({styles: styles});
    return map; //to make map available for use in application.
  }
  // this.exports.initializeMap = initializeMap;
  this.initializeMap = initializeMap;
}).call(this)
