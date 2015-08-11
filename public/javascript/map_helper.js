var geocoder = new google.maps.Geocoder();
var markers = [];

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
  setMarkerProperties(tweet, marker);
};

function setMarkerProperties(tweet, marker){
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