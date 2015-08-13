$(document).ready(function(){
  $("#textarea1").focus();
  $(".momo").on('click', function(){
    $("#siteInstructions").openModal();
  });
  Materialize.toast('Listening for tweets...');
  $(".toast").hide();
  var map = initializeMap();
  var socket = new Socket();
  socket.makeMarkerFromTweet(map);
  var searchWord;
  $("#search-form").on('submit', function(event){
    event.preventDefault();
    searchWord = $('#textarea1').val();

    $("#twitter-button").attr("href", 'http://twitter.com/home?status=I%27m%20tracking%20"'+searchWord+'"%20on%20Hashography!%20hashography.herokuapp.com');

    if (searchWord.match(/,.*,/)){
      Materialize.toast('You can only search for one or two terms', 2000);
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

  // $("#twitter-button").on('click', function(){
  //   console.log(searchWord);
  // });

  socket.listenForGeocode(map);
  socket.listenForError();
});





