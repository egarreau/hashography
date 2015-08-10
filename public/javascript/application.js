var socket = io.connect(window.location.host);

var geocoder = new google.maps.Geocoder();

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


//The following code was written by "Engineer" on Stack Overflow on June 19th 2012. http://stackoverflow.com/questions/11106671/google-maps-api-multiple-markers-with-infowindows
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

var styles = [
  {
    "featureType": "landscape",
    "stylers": [
      { "saturation": -100 },
      { "visibility": "on" },
      { "lightness": 4 },
      { "gamma": 1.31 }
    ]
  },{
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "saturation": -100 },
      { "visibility": "on" },
      { "gamma": 0.12 }
    ]
  },{
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      { "visibility": "on" },
      { "saturation": -100 },
      { "lightness": 100 }
    ]
  },{
    "featureType": "administrative.country",
    "elementType": "labels",
    "stylers": [
      { "color": "#858080" },
      { "saturation": -100 },
      { "weight": 0.2 },
      { "visibility": "simplified" },
      { "lightness": -9 }
    ]
  },{
    "featureType": "administrative.province",
    "stylers": [
      { "weight": 0.1 },
      { "lightness": 67 },
      { "visibility": "off" }
    ]
  },{
    "featureType": "water",
    "elementType": "labels",
    "stylers": [
      { "saturation": -100 },
      { "lightness": 39 },
      { "visibility": "on" },
      { "weight": 0.9 }
    ]
  },{
  }
]


$(document).ready(function(){
    $("#textarea1").focus();
    // socket.emit('reset')
    var mapOptions = {
      center: { lat: 20, lng: 0},
      zoom: 3
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    map.setOptions({styles: styles});

    socket.on('tweet', function(data){
      makeMarker(data.coordinates, map, data.tweet);
    });

    $("#search-form").on('submit', function(event){
      event.preventDefault();
      var searchWord = $('#textarea1').val();
      socket.emit('search', { word: searchWord });
      $('#textarea1').val('');
    })

    // socket.emit('search', {word: 'cat'})

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

    socket.on('openModal', function(){
        $('#modal1').openModal();
    });


})





