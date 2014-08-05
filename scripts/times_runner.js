var fs = require("fs");
var times = require("../server/source/times");
var distance = require("../server/source/distance");
var weights = require("../server/source/weights");

var concerts = JSON.parse(String(fs.readFileSync("data/concerts.json")));
var venues = JSON.parse(String(fs.readFileSync("data/venues.json")));

var schedule = times.findOptimalSchedule(distance.makeDistanceFunction(venues, "walking", 2), concerts, weights.weightsForPopularity(concerts, 5, 1));
console.log(schedule.map(function(artist) {
  var artists = {};
  concerts.forEach(function(concert) {
    artists[concert['artist-id']] = concert['artist-popularity'];
  })
  return { artist: artist, pop: artists[artist] };
}));
