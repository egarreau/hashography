$(document).ready(function(){
  $("#textarea1").focus();
  var map = initializeMap();
  var sockett = new Socket();
  sockett.makeMarkerFromTweet(map);
  $("#search-form").on('submit', function(event){
    event.preventDefault();
    var searchWord = $('#textarea1').val();
    // clear the map
    clearMarkers();
    sockett.performNewSearch(searchWord);
  });

  sockett.listenForGeocode(map);
  sockett.listenForError();
});





