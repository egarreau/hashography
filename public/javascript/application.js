$(document).ready(function(){
  $("#textarea1").focus();
  Materialize.toast('Listening for tweets...');
  $(".toast").hide();
  var map = initializeMap();
  var socket = new Socket();
  socket.makeMarkerFromTweet(map);
  $("#search-form").on('submit', function(event){
    event.preventDefault();
    $(".toast").show();
    // var doTimer = function(){return 5000};
    socket.listenForFirstTweet();
    var searchWord = $('#textarea1').val();
    // clear the map
    clearMarkers();
    socket.performNewSearch(searchWord);
  });

  socket.listenForGeocode(map);
  socket.listenForError();
});





