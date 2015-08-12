$(document).ready(function(){
  $("#textarea1").focus();
  Materialize.toast('Listening for tweets...');
  $(".toast").hide();
  var map = initializeMap();
  var socket = new Socket();
  socket.makeMarkerFromTweet(map);
  $("#search-form").on('submit', function(event){
    event.preventDefault();
    var searchWord = $('#textarea1').val();
    if (searchWord.match(/,.+,/)){
      Materialize.toast('You can only search for one or two terms', 2000);
      clearMarkers();
    }
    else
    {
      $(".toast").show();
      // var doTimer = function(){return 5000};
      socket.listenForFirstTweet();
      // clear the map
      clearMarkers();
      socket.performNewSearch(searchWord);
    }
  });

  socket.listenForGeocode(map);
  socket.listenForError();
});





