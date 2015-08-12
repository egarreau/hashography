// var socket = io.connect(window.location.host);
function Socket(){
  this.socket = io.connect(window.location.host);
  }

Socket.prototype.makeMarkerFromTweet = function(map){
  this.socket.on('tweet', function(data){
    // $(".toast").hide();
    makeMarker(data.coordinates, map, data.tweet, data.color, data.url);
  });
}

Socket.prototype.performNewSearch = function(searchWord){
  this.socket.emit('newSearch');
  this.socket.emit('search', { word: searchWord });
}

Socket.prototype.listenForGeocode = function(map){
  this.socket.on('geocoder', function(data){
    var address = data.location
    if (address !== ""){
      setTimeout(function(){
        geocoding(address, function(latLng) {
          makeMarker(latLng, map, data.tweet, data.color);
        });
      }, 500);
    }
  });
}

Socket.prototype.listenForError = function(){
  this.socket.on('openModal', function(data){
    $('#modal1').openModal();
  });
}

Socket.prototype.listenForFirstTweet = function(){
  console.log("listening...");
  this.socket.on('hideToast', function(){
    console.log("i'm supposed to be hiding...");
    $(".toast").hide();
  });
}
