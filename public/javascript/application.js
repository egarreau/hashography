// function makeMarker(lat, lng, map){
//   var marker = new google.maps.Marker({
//     position: { lat: lng, lng: lat },
//     map: map,
//     icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQglNi0Ylupo6wQ5jCRFHJ1bI98nTsjv1oW_o8s8IaysGhQVHKzcnx1pK4'
//   })
// }


// var Twitter = require('twitter');

// var client = new Twitter({
//   consumer_key: 'ncjKabjKKdcmnKkTyA0irhjIG',
//   consumer_secret: '63XT0n4AdCcad3v3g37fHwelbbekHERNFVgC5GJm7HWQJoXvg4',
//   access_token_key: '127879897-dSW0TRtfjE0eWYHyf0VHtH6UDNDFRCX1G8afJETN',
// });


// var streamData = function(searchTerm){
//   client.stream('statuses/filter', {track: searchTerm}, function(stream){
//     stream.on('data', function(tweet) {
//       console.log("Text: " + tweet.text);

//       if (tweet.coordinates === null || tweet.coordinates === undefined) {
//         if (tweet.place === null){
//           // parse tweet.user.location using CSV matching
//         }
//         else{
//           // send tweet.place.bounding_box.coordinates to map
//           tweet.place.bounding_box.coordinates;
//         };
//       }
//       else{
//         // send tweet.coordinates.coordinates to map
//         tweet.coordinates.coordinates;
//       };

//     });

//   });
// };

// $(document).ready(function(){
//   var mapOptions = {
//     center: { lat: 20, lng: 0},
//     zoom: 3
//   };
// debugger;
//   var map = new google.maps.Map(document.getElementById('map-canvas'),
//       mapOptions);

//   var midX = (22.2694931 + 22.9559184) / 2
//   var midY = (88.0944569 + 88.6100265) / 2
//   makeMarker(88.0944569, 22.2694931, map);
//   makeMarker(88.0944569, 22.9559184, map);
//   makeMarker(88.6100265, 22.9559184, map);
//   makeMarker(88.6100265, 22.2694931, map);
//   makeMarker(midY, midX, map);

//   // 88.0944569,22.2694931,88.0944569,22.9559184,88.6100265,22.9559184,88.6100265,22.2694931


// })
function makeMarker(lng, lat, map){
  var marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map
  })
}

function findBoxCenter(box){
  point1 = box[0]
  point2 = box[1]
  point3 = box[2]
  midX = (point1[1] + point2[1]) / 2
  midY = (point1[0] + point3[0]) / 2
  // makeMarker(midX, midY, map)
  return [midX, midY]
}

$(document).ready(function(){

    var mapOptions = {
      center: { lat: 20, lng: 85},
      zoom: 6
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    box = [[88.0944569,22.2694931],[88.0944569,22.9559184],[88.6100265,22.9559184],[88.6100265,22.2694931]]

    mid = findBoxCenter(box);
    makeMarker(mid[1], mid[0], map)

})





