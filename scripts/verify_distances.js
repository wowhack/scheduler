// Script that was used to get distances between different venues.
// It's no longer useful, and only here for reference.

var fs = require("fs");
var http = require("http");

var venues = JSON.parse(String(fs.readFileSync("data/venues.json")));


var modes = ["driving", "walking", "bicycling"];

function forEachValue(obj, cb) {
  for (var key in obj) {
    cb(obj[key], key);
  }
}

forEachValue(venues, function(venue, name) {
  venue.distances = venue.distances || {};

  forEachValue(venues, function(otherVenue, otherName) {
    modes.forEach(function(mode) {
      if (name == otherName) return;
      if (!venue.distances[mode][otherName]) {
        console.log("HEY!", name, otherName);
      }
    });
  });
});
