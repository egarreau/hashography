var geocoder = new google.maps.Geocoder();

socket.on('geocoder', function(data){
  var address = data.location
  if (address === "")
  {
    console.log("Blank string")
  }
  else {
  setTimeout(geocoding(address), 500);
  };
});

var geocoding = function(address) {
  geocoder.geocode({"address": address}, function(results, status){
    if (status == google.maps.GeocoderStatus.OK){
      var location = results[0].geometry.location
      var lat = location.G
      var lng = location.K
      console.log([lat, lng]);
    }
    else {
      console.log("Geocode was not successful for the following reason: "+ status)
    }
  })
};
