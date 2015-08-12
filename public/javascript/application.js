$(document).ready(function(){
  $("#textarea1").focus();

  // $(".target").effect( "bounce", {times:3}, 300 );
  $(".momo").on('mouseover', function(){
    $("#siteInstructions").openModal();
  });
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

//acting weird
// $(window).load(function() {
//     $( ".momo" ).effect( "bounce", { times: 4, distance: 8 }, 4000 );
// });




