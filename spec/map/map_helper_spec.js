document = {getElementById: function() {}};
google = require('../support/google_maps_mock.coffee');
styles = require("../../public/javascript/map_styles_helper.js");
var mapsHelpers = require("../../public/javascript/map_helper.js");


describe('initializeMap', function() {
  it('returns a new map', function() {
    var map = mapsHelpers.initializeMap();

    expect(map).toEqual(jasmine.any(google.maps.Map))
  });

  it('interacts with the "#map-canvas dom element', function() {
    spyOn(document, "getElementById");

    var map = mapsHelpers.initializeMap();

    expect(document.getElementById).toHaveBeenCalledWith('map-canvas');
  });

  it('sets the styles on the map', function() {
    spyOn(google.maps.Map.prototype, "setOptions")

    var map = mapsHelpers.initializeMap();

    expect(google.maps.Map.prototype.setOptions).toHaveBeenCalledWith({styles: styles});
  });
});

describe('geocoding', function() {
  it('call a callback with a latLng pair', function() {
    // mock the geocoder to call a callback with a "results" object, which includes a lat lng pair
    var lat = 42;
    var lng = 45;

    spyOn(mapsHelpers.geocoder, "geocode").andCallFake(function(data, callback) {
      callback([{geometry: {location: {G: lat, K: lng}}}], google.maps.GeocoderStatus.OK)
    });

    geocodeObj = {callback: function() {}};
    spyOn(geocodeObj, "callback")

    // the system under test
    mapsHelpers.geocoding("351 W. Hubbard Suite 701, Chicago, IL 60654",
      geocodeObj.callback);

    expect(geocodeObj.callback).toHaveBeenCalledWith([lat, lng]);
  })
})

describe('makeMarker', function(){
  // markers array goes from empty to 1
  // contains a google.maps.Marker
});
