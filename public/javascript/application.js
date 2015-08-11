$(document).ready(function(){
    $("#textarea1").focus();
    // socket.emit('reset')

    var map = initializeMap();

    socket.on('tweet', function(data){
      makeMarker(data.coordinates, map, data.tweet);
      toast.destroy()
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





